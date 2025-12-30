import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// Fail fast if env is missing
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Extend globalThis to store Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
const connectionString = `${process.env.DATABASE_URL}`;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: connectionString }),
    log: ["error"],
  });

// Prevent multiple instances in dev (nodemon / ts-node)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
