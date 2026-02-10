import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const costs = await prisma.operatingCost.findMany({
    orderBy: { createdAt: "desc" },
    include: { reportingPeriod: { select: { label: true } } },
  });

  return NextResponse.json(costs);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reportingPeriodId, description, amount } = await request.json();

  const cost = await prisma.operatingCost.create({
    data: { reportingPeriodId, description, amount: parseFloat(amount) },
  });

  return NextResponse.json(cost);
}
