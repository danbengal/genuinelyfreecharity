import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const allocations = await prisma.allocation.findMany({
    orderBy: { allocatedAt: "desc" },
    include: {
      recipient: { select: { name: true } },
      reportingPeriod: { select: { label: true } },
    },
  });

  const data = allocations.map((a) => ({
    id: a.id,
    allocatedAt: a.allocatedAt.toISOString(),
    recipientName: a.recipient.name,
    periodLabel: a.reportingPeriod.label,
    grossRevenue: a.grossRevenue,
    operatingCosts: a.operatingCosts,
    netAmount: a.netAmount,
    proofUrl: a.proofUrl,
    notes: a.notes,
  }));

  return NextResponse.json(data);
}
