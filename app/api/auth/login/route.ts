import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/session"
import { hashPhone } from "@/lib/hash-phone"

export const runtime = 'nodejs'

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function POST(request: NextRequest) {
    try {
        const { phone: rawPhone, pin }: { phone: string; pin: string } = await request.json()

        console.log("🔍 Login attempt:", { rawPhone, pinLength: pin?.length })

        // Normalize and hash phone using shared utility
        if (!rawPhone || !pin || !/^\d{6}$/.test(pin)) {
            console.log("❌ Validation failed:", { hasPhone: !!rawPhone, hasPin: !!pin, pinValid: !/^\d{6}$/.test(pin) })
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        const hashedPhone = await hashPhone(rawPhone)
        console.log("🔐 Hashed phone:", hashedPhone)

        const user = await prisma.users.findFirst({
            where: { hashed_phone: hashedPhone },
        })

        console.log("👤 User found:", !!user, user ? { id: user.id, hasPin: !!user.pin } : null)

        if (!user || !user.pin) {
            console.log("❌ No user found or no PIN set")
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Verify PIN using SHA-256 hash comparison
        const hashedInputPin = await hashData(pin)
        const pinMatch = hashedInputPin === user.pin

        console.log("🔑 PIN match:", pinMatch)
        console.log("   Input hash:", hashedInputPin)
        console.log("   Stored hash:", user.pin)

        if (!pinMatch) {
            console.log("❌ PIN mismatch")
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