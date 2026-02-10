import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reports = await prisma.adSenseRevenueReport.findMany({
    orderBy: { createdAt: "desc" },
    include: { reportingPeriod: { select: { label: true } } },
  });

  return NextResponse.json(reports);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reportingPeriodId, amount, notes } = await request.json();

  const report = await prisma.adSenseRevenueReport.create({
    data: { reportingPeriodId, amount: parseFloat(amount), notes },
  });

  return NextResponse.json(report);
}
