import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalResult, todayResult, monthResult, last30Result, lastAllocation, recipientCount] = await Promise.all([
    prisma.allocation.aggregate({ _sum: { netAmount: true } }),
    prisma.allocation.aggregate({ _sum: { netAmount: true }, where: { allocatedAt: { gte: startOfDay } } }),
    prisma.allocation.aggregate({ _sum: { netAmount: true }, where: { allocatedAt: { gte: startOfMonth } } }),
    prisma.allocation.aggregate({ _sum: { netAmount: true }, where: { allocatedAt: { gte: last30Days } } }),
    prisma.allocation.findFirst({ orderBy: { allocatedAt: "desc" }, select: { allocatedAt: true } }),
    prisma.recipient.count({ where: { allocations: { some: {} } } }),
  ]);

  return NextResponse.json({
    totalAllocated: totalResult._sum.netAmount || 0,
    allocatedToday: todayResult._sum.netAmount || 0,
    allocatedThisMonth: monthResult._sum.netAmount || 0,
    allocatedLast30Days: last30Result._sum.netAmount || 0,
    lastAllocationDate: lastAllocation?.allocatedAt?.toISOString() || null,
    recipientCount,
  });
}
