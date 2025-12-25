import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const histories = await prisma.history.findMany({
    orderBy: { createdAt: "desc" },
  });

  const seen = new Set();
  const toDelete = [];

  for (const h of histories) {
    const key = `${h.user}-${h.videoId}`;
    if (seen.has(key)) {
      toDelete.push(h.id);
    } else {
      seen.add(key);
    }
  }

  if (toDelete.length > 0) {
    await prisma.history.deleteMany({
      where: { id: { in: toDelete } },
    });
  }

  console.log(" Duplicate history entries removed:", toDelete.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());