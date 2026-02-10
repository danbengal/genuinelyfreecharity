import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { question, isActive } = await request.json();

  if (isActive) {
    await prisma.poll.updateMany({ data: { isActive: false } });
  }

  const poll = await prisma.poll.update({
    where: { id },
    data: { question, isActive: !!isActive },
    include: { options: true },
  });

  return NextResponse.json(poll);
}
