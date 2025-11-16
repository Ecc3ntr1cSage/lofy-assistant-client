import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/session"

export async function GET(request: NextRequest) {
    try {
        console.log('Calendar API: All cookies:', request.cookies.getAll());

        const token = request.cookies.get("session")?.value

        if (!token) {
            console.error("Calendar API: No token found in cookies")
            return NextResponse.json(
                { error: "Unauthorized - No token found" },
                { status: 401 }
            )
        }

        console.log('Calendar API: Token found:', token ? `${token.substring(0, 20)}...` : 'null');

        const session = await verifySession(token)

        if (!session?.userId) {
            console.error("Calendar API: Invalid session or no userId", session)
            return NextResponse.json(
                { error: "Invalid session" },
                { status: 401 }
            )
        }

        console.log("Calendar API: Fetching events for user:", session.userId)

        const events = await prisma.calendar_events.findMany({
            where: {
                user_id: session.userId,
            },
            orderBy: {
                start_time: "asc",
            },
        })

        console.log("Calendar API: Found", events.length, "events")

        return NextResponse.json({ events }, { status: 200 })
    } catch (error) {
        console.error("Calendar API Error:", error)
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        )
    }
}
