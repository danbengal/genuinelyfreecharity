import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean everything
  await prisma.vote.deleteMany();
  await prisma.participationLimit.deleteMany();
  await prisma.allocation.deleteMany();
  await prisma.operatingCost.deleteMany();
  await prisma.adSenseRevenueReport.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.reportingPeriod.deleteMany();
  await prisma.recipient.deleteMany();

  // Create real charity recipients (no allocations yet — site is new)
  await prisma.recipient.createMany({
    data: [
      { name: "St. Jude Children's Research Hospital", website: "https://www.stjude.org" },
      { name: "Doctors Without Borders", website: "https://www.doctorswithoutborders.org" },
      { name: "Good360", website: "https://good360.org" },
      { name: "One Child", website: "https://onechild.org" },
      { name: "Habitat for Humanity", website: "https://www.habitat.org" },
    ],
  });

  // Create active poll
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

  console.log("✅ Clean seed complete — charities + poll created, zero financials.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
