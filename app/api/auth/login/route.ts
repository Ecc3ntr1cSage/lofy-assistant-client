import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/session"

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        let { phone, pin }: { phone: string; pin: string } = await request.json()

        // Normalize phone: remove all non-digits including '+'
        phone = phone.replace(/\D/g, "")

        if (!phone || !pin || !/^\d{6}$/.test(pin)) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Hash phone directly using Web Crypto API
        const encoder = new TextEncoder()
        const data = encoder.encode(phone)
        const hashBuffer = await crypto.subtle.digest("SHA-256", data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashedPhone = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")

        const user = await prisma.users.findFirst({
            where: { hashed_phone: hashedPhone },
        })

        if (!user || !user.pin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Verify PIN
        const pinMatch = await bcrypt.compare(pin, user.pin)

        if (!pinMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Update last login
        await prisma.users.update({
            where: { id: user.id },
            data: { updated_at: new Date() },
        })

        const token = await createSession(user.id)

        const response = NextResponse.json(
            { success: true, user: { id: user.id, name: user.name } },
            { status: 200 }
        )

        response.cookies.set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
            path: "/",
        })

        return response
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "Login failed" }, { status: 500 })
    }
}