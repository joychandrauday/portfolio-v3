// lib/db/index.ts — Prisma Client Singleton for Next.js
// Replaces Drizzle ORM + LibSQL client. Works with PostgreSQL (Neon).

import { PrismaClient } from "@prisma/client";

// Prevent multiple Prisma instances during Next.js HMR
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Export types for convenience
export type Post = import("@prisma/client").Post;
export type Project = import("@prisma/client").Project;
export type Experience = import("@prisma/client").Experience;
export type JobApplication = import("@prisma/client").JobApplication;
export type Company = import("@prisma/client").Company;
export type Learning = import("@prisma/client").Learning;
export type Email = import("@prisma/client").Email;
export type Inquiry = import("@prisma/client").Inquiry;
export type AppSetting = import("@prisma/client").AppSetting;

// Health check
export async function checkDbConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// Graceful disconnect
export async function disconnectDb() {
  await prisma.$disconnect();
}