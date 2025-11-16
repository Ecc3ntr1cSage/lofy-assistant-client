import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient();

async function main() {
    const memoriesData = [
        // 5 records for user 46ded2fe-2e93-44af-bf3d-69cf48c283c8
        { user_id: "46ded2fe-2e93-44af-bf3d-69cf48c283c8", title: "Morning Thoughts", content: "Had a productive morning reading." },
        { user_id: "46ded2fe-2e93-44af-bf3d-69cf48c283c8", title: "Workout Log", content: "Ran 3km at a 5:30/km pace." },
        { user_id: "46ded2fe-2e93-44af-bf3d-69cf48c283c8", title: "Idea", content: "Think about building a dragon gold optimization app." },
        { user_id: "46ded2fe-2e93-44af-bf3d-69cf48c283c8", title: "Shopping List", content: "Buy groceries: eggs, milk, bread." },
        { user_id: "46ded2fe-2e93-44af-bf3d-69cf48c283c8", title: "Reminder", content: "Check Supabase seed script for memories table." },

        // 7 records for user b2d78c7a-c8ce-4e92-97bb-242aa1642b3d
        { user_id: "b2d78c7a-c8ce-4e92-97bb-242aa1642b3d", title: "Daily Notes", content: "Completed project task for today." },
        { user_id: "b2d78c7a-c8ce-4e92-97bb-242aa1642b3d", title: "Idea", content: "Start a small side project using TALL stack." },
        { user_id: "b2d78c7a-c8ce-4e92-97bb-242aa1642b3d", title: "Meeting Notes", content: "Discussed API integration with Supabase." },
        { user_id: "b2d78c7a-c8ce-4e92-97bb-242aa1642b3d", title: "Shopping", content: "Order a new keyboard online." },
        { user_id: "b2d78c7a-c8ce-4e92-97bb-242aa1642b3d", title: "Fitness", content: "Yoga session completed." },
        { user_id: "b2d78c7a-c8ce-4e92-97bb-242aa1642b3d", title: "Books", content: "Read 20 pages of a novel." },
        { user_id: "b2d78c7a-c8ce-4e92-97bb-242aa1642b3d", title: "Reminder", content: "Update Prisma seed script with memories data." },
    ];

    await prisma.memories.createMany({
        data: memoriesData,
    });

    console.log("Memories seeded successfully ✅");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });