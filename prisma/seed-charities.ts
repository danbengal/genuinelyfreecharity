import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Deactivate all existing polls
  await prisma.poll.updateMany({ data: { isActive: false } });

  // Create the charity poll
  const poll = await prisma.poll.create({
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
    include: { options: true },
  });

  console.log("✅ Charity poll created:", poll.id);
  console.log("Options:", poll.options.map(o => o.text).join(", "));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
