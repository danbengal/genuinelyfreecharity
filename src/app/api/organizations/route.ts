import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const recipients = await prisma.recipient.findMany({
    where: { allocations: { some: {} } },
    include: {
      allocations: {
        select: { netAmount: true, allocatedAt: true },
        orderBy: { allocatedAt: "desc" },
      },
    },
  });

  const data = recipients.map((r) => ({
    id: r.id,
    name: r.name,
    website: r.website,
    totalLifetime: r.allocations.reduce((sum, a) => sum + a.netAmount, 0),
    totalThisMonth: r.allocations
      .filter((a) => a.allocatedAt >= startOfMonth)
      .reduce((sum, a) => sum + a.netAmount, 0),
    lastAllocationDate: r.allocations[0]?.allocatedAt?.toISOString() || null,
  }));

  data.sort((a, b) => b.totalLifetime - a.totalLifetime);

  return NextResponse.json(data);
}
