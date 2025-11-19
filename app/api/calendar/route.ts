import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

// Helper: build date filter if month/year provided
const buildDateFilter = (month?: string | null, year?: string | null) => {
    if (!month || !year) return {};

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    return {
        OR: [
            // Events starting inside the month
            { start_time: { gte: startDate, lte: endDate } },

            // Events ending inside the month
            { end_time: { gte: startDate, lte: endDate } },

            // Events spanning across the entire month
            {
                AND: [
                    { start_time: { lt: startDate } },
                    { end_time: { gt: endDate } },
                ],
            },
        ],
    };
};

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("session")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - missing session token" },
                { status: 401 }
            );
        }

        const session = await verifySession(token);

        if (!session?.userId) {
            return NextResponse.json(
                { error: "Unauthorized - invalid session" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const month = searchParams.get("month");
        const year = searchParams.get("year");

        const dateFilter = buildDateFilter(month, year);

        const events = await prisma.calendar_events.findMany({
            where: {
                user_id: session.userId,
                ...dateFilter,
            },
            orderBy: { start_time: "asc" },
        });

        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error("Calendar API Error:", error);

        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
