import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/session"

function hashPhone(phone: string): string {
    const normalizedPhone = phone.replace(/\D/g, "")
    return crypto.createHash("sha256").update(normalizedPhone).digest("hex")
}

export async function POST(request: NextRequest) {
    try {
        let { phone, pin }: { phone: string; pin: string } = await request.json()
        console.log("Received phone:", phone, "Type:", typeof phone)
        console.log("Received pin:", pin, "Type:", typeof pin, "Length:", pin.length)

        // Normalize phone: remove all non-digits including '+'
        phone = phone.replace(/\D/g, "")
        console.log("Normalized phone:", phone)

        if (!phone || !pin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Validate PIN format - must be exactly 6 digits
        if (!/^\d{6}$/.test(pin)) {
            console.log("Invalid PIN format:", pin)
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        const hashedPhone = hashPhone(phone)
        console.log("Hashed phone:", hashedPhone)

        const user = await prisma.users.findUnique({
            where: { hashed_phone: hashedPhone },
        })
        console.log("User found:", user ? "yes" : "no")

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Check if user has a PIN set
        if (!user.pin) {
            console.log("User has no PIN set")
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        console.log("User PIN hash length:", user.pin.length)
        console.log("Comparing PIN:", pin, "with hash:", user.pin.substring(0, 20) + "...")

        // Verify PIN (bcrypt with salt is fine for PIN)
        const pinMatch = await bcrypt.compare(pin, user.pin)
        console.log("PIN match:", pinMatch)

        if (!pinMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Update last login (if your schema has this field)
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
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
        return NextResponse.json({ error: "Login failed" }, { status: 500 })
    }
}