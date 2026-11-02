import { prisma } from "@/lib/db";

/**
 * Fetch a paginated list of sent emails.
 * @param limit Number of records to return (default 20)
 * @param offset Offset for pagination (default 0)
 */
export async function listEmails(limit: number = 20, offset: number = 0) {
  return prisma.email.findMany({
    orderBy: { sentAt: "desc" },
    take: limit,
    skip: offset,
  });
}

/** Fetch a single email record by its id */
export async function getEmail(id: string) {
  const email = await prisma.email.findUnique({ where: { id } });
  return email ?? undefined;
}
