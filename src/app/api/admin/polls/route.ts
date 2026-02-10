import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const polls = await prisma.poll.findMany({
    orderBy: { createdAt: "desc" },
    include: { options: true, _count: { select: { votes: true } } },
  });

  return NextResponse.json(polls);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question, options, isActive } = await request.json();

  if (!question || !options || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ error: "Question and at least 2 options required" }, { status: 400 });
  }

  // If setting as active, deactivate others
  if (isActive) {
    await prisma.poll.updateMany({ data: { isActive: false } });
  }

  const poll = await prisma.poll.create({
    data: {
      question,
      isActive: !!isActive,
      options: {
        create: options.map((text: string) => ({ text })),
      },
    },
    include: { options: true },
  });

  return NextResponse.json(poll);
}
