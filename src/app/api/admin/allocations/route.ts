import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recipientId, reportingPeriodId, grossRevenue, operatingCosts, netAmount, proofUrl, notes } = await request.json();

  const allocation = await prisma.allocation.create({
    data: {
      recipientId,
      reportingPeriodId,
      grossRevenue: parseFloat(grossRevenue),
      operatingCosts: parseFloat(operatingCosts),
      netAmount: parseFloat(netAmount),
      proofUrl: proofUrl || null,
      notes: notes || null,
    },
  });

  return NextResponse.json(allocation);
}
