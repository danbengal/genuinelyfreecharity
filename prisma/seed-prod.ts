import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check if active poll exists
  const existing = await prisma.poll.findFirst({ where: { isActive: true } });
  if (existing) {
    console.log("Active poll already exists, skipping seed.");
    return;
  }

  // Create the charity poll
  await prisma.poll.create({
    data: {
      question: "Which charity should receive this month's donation?",
      isActive: true,
      options: {
        create: [
          { text: "St. Jude Children's Research Hospital" },
          { text: "Doctors Without Borders" },
          { text: "Good360" },
          { text: "One Child" },
          { text: "Habitat for Humanity" },
        ],
      },
    },
  });

  console.log("✅ Charity poll seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
