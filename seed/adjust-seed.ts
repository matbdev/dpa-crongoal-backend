import { prisma } from '../src/config/prisma';

const action = process.argv[2];
const email = 'seeduser@crongoal.test';

function getRandomDays(maxDays: number) {
    // 20% de chance de ser "hoje" (0 dias de dispersão)
    if (Math.random() < 0.2) return 0;
    return Math.random() * maxDays;
}

async function main() {
    // Find the user
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.error(`[Error] User with email ${email} not found.`);
        process.exit(1);
    }

    if (action === 'points') {
        // Update user points to 5000
        await prisma.user.update({
            where: { id: user.id },
            data: { pointsBalance: 5000 }
        });
        console.log(`[Success] Points balance updated to 5000 for ${email}.`);
    } else if (action === 'disperse') {
        console.log('Dispersing dates and generating overdue items...');

        // 1. Disperse created_at for tasks (last 60 days)
        const tasks = await prisma.task.findMany({ where: { userId: user.id } });
        for (const task of tasks) {
            const randomDays = getRandomDays(60);
            const createdAt = new Date(Date.now() - randomDays * 24 * 60 * 60 * 1000);
            await prisma.task.update({
                where: { id: task.id },
                data: { createdAt }
            });
        }
        console.log(`Tasks: dispersed created_at dates for ${tasks.length} tasks.`);

        // 2. Disperse created_at for projects (last 45 days)
        const projects = await prisma.project.findMany({ where: { userId: user.id } });
        for (const project of projects) {
            const randomDays = getRandomDays(45);
            const createdAt = new Date(Date.now() - randomDays * 24 * 60 * 60 * 1000);
            await prisma.project.update({
                where: { id: project.id },
                data: { createdAt }
            });
        }
        console.log(`Projects: dispersed created_at dates for ${projects.length} projects.`);

        // 3. Disperse created_at for routines (last 30 days)
        const routines = await prisma.routine.findMany({ where: { userId: user.id } });
        for (const routine of routines) {
            const randomDays = getRandomDays(30);
            const createdAt = new Date(Date.now() - randomDays * 24 * 60 * 60 * 1000);
            await prisma.routine.update({
                where: { id: routine.id },
                data: { createdAt }
            });
        }
        console.log(`Routines: dispersed created_at dates for ${routines.length} routines.`);

        // 4. Disperse register_date for daily_registers (last 30 days)
        const registers = await prisma.dailyRegister.findMany({
            where: { task: { userId: user.id } }
        });
        for (const reg of registers) {
            const randomDays = getRandomDays(30);
            const registerDate = new Date(Date.now() - randomDays * 24 * 60 * 60 * 1000);
            await prisma.dailyRegister.update({
                where: { id: reg.id },
                data: { registerDate }
            });
        }
        console.log(`Daily Registers: dispersed register_date for ${registers.length} registers.`);

        // 5. Disperse redeem_date for redeems (last 20 days)
        const redeems = await prisma.redeemHistory.findMany({ where: { userId: user.id } });
        for (const redeem of redeems) {
            const randomDays = getRandomDays(20);
            const redeemDate = new Date(Date.now() - randomDays * 24 * 60 * 60 * 1000);
            await prisma.redeemHistory.update({
                where: { id: redeem.id },
                data: { redeemDate }
            });
        }
        console.log(`Redeems: dispersed redeem_date for ${redeems.length} redeems.`);

        // 6. Make 3 non-completed projects overdue
        const activeProjects = await prisma.project.findMany({
            where: { userId: user.id, isCompleted: false }
        });
        // Shuffle active projects
        const shuffledProjects = activeProjects.sort(() => 0.5 - Math.random()).slice(0, 3);
        for (const proj of shuffledProjects) {
            const overdueDays = 3 + Math.random() * 15;
            const limitDate = new Date(Date.now() - overdueDays * 24 * 60 * 60 * 1000);
            const projectAgeDays = 20 + Math.random() * 30;
            const createdAt = new Date(Date.now() - projectAgeDays * 24 * 60 * 60 * 1000);
            await prisma.project.update({
                where: { id: proj.id },
                data: { limitDate, createdAt }
            });
        }
        console.log(`Projects Overdue: marked ${shuffledProjects.length} projects as overdue.`);

        // 7. Make 5 unique tasks stale (old date, not completed)
        const uniqueIncompleteTasks = await prisma.task.findMany({
            where: { userId: user.id, isCompleted: false, projectId: null, type: 'UNIQUE' }
        });
        const shuffledStaleTasks = uniqueIncompleteTasks.sort(() => 0.5 - Math.random()).slice(0, 5);
        for (const task of shuffledStaleTasks) {
            const randomDays = 30 + Math.random() * 30;
            const createdAt = new Date(Date.now() - randomDays * 24 * 60 * 60 * 1000);
            await prisma.task.update({
                where: { id: task.id },
                data: { createdAt }
            });
        }
        console.log(`Tasks Stale: marked ${shuffledStaleTasks.length} tasks as stale.`);

        // 8. Make 4 unique tasks completed
        const uniqueTasksToComplete = await prisma.task.findMany({
            where: { userId: user.id, isCompleted: false, projectId: null, type: 'UNIQUE' }
        });
        const shuffledCompleteTasks = uniqueTasksToComplete.sort(() => 0.5 - Math.random()).slice(0, 4);
        for (const task of shuffledCompleteTasks) {
            const randomDays = 10 + Math.random() * 20;
            const createdAt = new Date(Date.now() - randomDays * 24 * 60 * 60 * 1000);
            await prisma.task.update({
                where: { id: task.id },
                data: { isCompleted: true, status: 'DONE', createdAt }
            });
        }
        console.log(`Tasks Completed: marked ${shuffledCompleteTasks.length} tasks as completed.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
