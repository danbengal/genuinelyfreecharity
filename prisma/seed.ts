import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean
  await prisma.vote.deleteMany();
  await prisma.participationLimit.deleteMany();
  await prisma.allocation.deleteMany();
  await prisma.operatingCost.deleteMany();
  await prisma.adSenseRevenueReport.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.reportingPeriod.deleteMany();
  await prisma.recipient.deleteMany();

  // Create recipients
  const waterOrg = await prisma.recipient.create({
    data: { name: "Clean Water Initiative", website: "https://example.com/water" },
  });
  const foodBank = await prisma.recipient.create({
    data: { name: "Community Food Bank", website: "https://example.com/food" },
  });
  const shelterOrg = await prisma.recipient.create({
    data: { name: "Safe Shelter Project", website: "https://example.com/shelter" },
  });

  // Create reporting periods
  const dec2024 = await prisma.reportingPeriod.create({
    data: { label: "December 2024", startDate: new Date("2024-12-01"), endDate: new Date("2024-12-31") },
  });
  const jan2025 = await prisma.reportingPeriod.create({
    data: { label: "January 2025", startDate: new Date("2025-01-01"), endDate: new Date("2025-01-31") },
  });

  // Revenue reports
  await prisma.adSenseRevenueReport.create({
    data: { reportingPeriodId: dec2024.id, amount: 142.50, notes: "December AdSense earnings" },
  });
  await prisma.adSenseRevenueReport.create({
    data: { reportingPeriodId: jan2025.id, amount: 187.30, notes: "January AdSense earnings" },
  });

  // Operating costs
  await prisma.operatingCost.create({
    data: { reportingPeriodId: dec2024.id, description: "Vercel hosting", amount: 20.00 },
  });
  await prisma.operatingCost.create({
    data: { reportingPeriodId: dec2024.id, description: "Domain renewal", amount: 12.99 },
  });
  await prisma.operatingCost.create({
    data: { reportingPeriodId: jan2025.id, description: "Vercel hosting", amount: 20.00 },
  });
  await prisma.operatingCost.create({
    data: { reportingPeriodId: jan2025.id, description: "Database (Neon)", amount: 5.00 },
  });

  // Allocations
  await prisma.allocation.create({
    data: {
      recipientId: waterOrg.id, reportingPeriodId: dec2024.id,
      grossRevenue: 142.50, operatingCosts: 32.99, netAmount: 54.76,
      proofUrl: "https://example.com/proof/dec2024-water",
      notes: "50% of net to Clean Water Initiative",
      allocatedAt: new Date("2025-01-05"),
    },
  });
  await prisma.allocation.create({
    data: {
      recipientId: foodBank.id, reportingPeriodId: dec2024.id,
      grossRevenue: 142.50, operatingCosts: 32.99, netAmount: 54.75,
      proofUrl: "https://example.com/proof/dec2024-food",
      notes: "50% of net to Community Food Bank",
      allocatedAt: new Date("2025-01-05"),
    },
  });
  await prisma.allocation.create({
    data: {
      recipientId: shelterOrg.id, reportingPeriodId: jan2025.id,
      grossRevenue: 187.30, operatingCosts: 25.00, netAmount: 81.15,
      proofUrl: "https://example.com/proof/jan2025-shelter",
      notes: "50% of net to Safe Shelter Project",
      allocatedAt: new Date("2025-02-03"),
    },
  });
  await prisma.allocation.create({
    data: {
      recipientId: waterOrg.id, reportingPeriodId: jan2025.id,
      grossRevenue: 187.30, operatingCosts: 25.00, netAmount: 81.15,
      proofUrl: "https://example.com/proof/jan2025-water",
      notes: "50% of net to Clean Water Initiative",
      allocatedAt: new Date("2025-02-03"),
    },
  });

  // Create active poll
  await prisma.poll.create({
    data: {
      question: "What cause matters most to you right now?",
      isActive: true,
      options: {
        create: [
          { text: "Clean drinking water" },
          { text: "Food security" },
          { text: "Housing & shelter" },
          { text: "Education access" },
          { text: "Mental health support" },
        ],
      },
    },
  });

  // Create inactive poll
  await prisma.poll.create({
    data: {
      question: "How did you find this site?",
      isActive: false,
      options: {
        create: [
          { text: "Social media" },
          { text: "Search engine" },
          { text: "Friend or family" },
          { text: "News article" },
        ],
      },
    },
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
