
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const clientOptions = {
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
};

export const prisma =
    globalForPrisma.prisma ?? new PrismaClient(clientOptions as any);

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}