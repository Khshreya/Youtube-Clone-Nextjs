import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function backup() {
  const videos = await prisma.video.findMany();

  fs.writeFileSync(
    "video-backup.json",
    JSON.stringify(videos, null, 2)
  );

  console.log("✅ Video backup saved to video-backup.json");
}

backup()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
