import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient();

async function main() {
    const user1 = "46ded2fe-2e93-44af-bf3d-69cf48c283c8";
    const user2 = "b2d78c7a-c8ce-4e92-97bb-242aa1642b3d";

    // Utility to generate event times
    const addHours = (date: Date, hours: number) => {
        const copy = new Date(date);
        copy.setHours(copy.getHours() + hours);
        return copy;
    };

    const now = new Date();

    const eventsUser1 = Array.from({ length: 5 }).map((_, i) => {
        const start = addHours(now, i * 6 + 2);
        const end = addHours(start, 2);

        return {
            user_id: user1,
            title: `User 1 Event ${i + 1}`,
            description: `Sample description for event ${i + 1}`,
            start_time: start,
            end_time: end,
            timezone: "Asia/Kuala_Lumpur",
            is_all_day: false,
        };
    });

    const eventsUser2 = Array.from({ length: 10 }).map((_, i) => {
        const start = addHours(now, i * 4 + 1);
        const end = addHours(start, 1 + (i % 3));

        return {
            user_id: user2,
            title: `User 2 Event ${i + 1}`,
            description: `Event details for user 2 - ${i + 1}`,
            start_time: start,
            end_time: end,
            timezone: "Asia/Kuala_Lumpur",
            is_all_day: false,
        };
    });

    await prisma.calendar_events.createMany({
        data: [...eventsUser1, ...eventsUser2],
    });

    console.log("Calendar events seeded successfully");

    const addMinutes = (date: Date, minutes: number) => {
        const copy = new Date(date);
        copy.setMinutes(copy.getMinutes() + minutes);
        return copy;
    };

    const remindersUser1 = Array.from({ length: 5 }).map((_, i) => ({
        user_id: user1,
        message: `User 1 reminder ${i + 1}`,
        reminder_time: addMinutes(now, (i + 1) * 30),
        status: i % 2 === 0 ? "pending" : "completed",
    }));

    const remindersUser2 = Array.from({ length: 10 }).map((_, i) => ({
        user_id: user2,
        message: `User 2 reminder ${i + 1}`,
        reminder_time: addMinutes(now, (i + 1) * 20),
        status: i % 3 === 0 ? "completed" : "pending",
    }));

    await prisma.reminders.createMany({
        data: [...remindersUser1, ...remindersUser2],
    });

    console.log("Reminders seeded successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });