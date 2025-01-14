import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createFakeUser() {
    return await prisma.user.create({
        data: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            emailVerified: faker.date.recent(),
            stripeCustomerId: faker.string.uuid(),
            role: "MEMBER",
            availabilities: {},
        },
    });
}

async function createFakeAvailability(memberId: string) {
    return await prisma.availability.create({
        data: {
            id: faker.string.uuid(),
            memberId: memberId,
            day: faker.date.weekday(),
            startTime: "12:10",
            endTime: "12:11",
            createdAt: faker.date.between({ from: "2025-01-01", to: Date.now() }),
            updatedAt: faker.date.between({ from: "2025-01-01", to: Date.now() }),
        },
    });
}

async function main() {
    const user = await createFakeUser();
    console.log("Created user:", user);

    for (let i = 0; i < 5; i++) {
        const availability = await createFakeAvailability(user.id);
        console.log("Created availability:", availability);
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
