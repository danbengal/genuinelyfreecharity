/**
 * Poll Rotation Script
 * 
 * Automatically rotates to the next inactive poll and makes it active.
 * Can be run manually or via a cron job.
 * 
 * Usage:
 *   npx tsx scripts/rotate-poll.ts
 * 
 * Cron example (daily at 00:00):
 *   0 0 * * * cd /path/to/app && npx tsx scripts/rotate-poll.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function rotatePoll() {
  try {
    // Get current active poll
    const activePoll = await prisma.poll.findFirst({
      where: { isActive: true },
    });

    // Get next inactive poll (ordered by creation date)
    const nextPoll = await prisma.poll.findFirst({
      where: { isActive: false },
      orderBy: { createdAt: "asc" },
    });

    if (!nextPoll) {
      console.log("⚠️  No inactive polls available. Create more polls first.");
      return;
    }

    // Deactivate current poll
    if (activePoll) {
      await prisma.poll.update({
        where: { id: activePoll.id },
        data: { isActive: false },
      });
      console.log(`✓ Deactivated: "${activePoll.question}"`);
    }

    // Activate next poll
    await prisma.poll.update({
      where: { id: nextPoll.id },
      data: { isActive: true },
    });

    console.log(`✓ Activated: "${nextPoll.question}"`);
    console.log(`✅ Poll rotation completed successfully!`);
  } catch (error) {
    console.error("❌ Error rotating poll:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

rotatePoll();
