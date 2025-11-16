"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function getCalendarEvents() {
    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const events = await prisma.calendar_events.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            start_time: "asc",
        },
    })

    return events
}
