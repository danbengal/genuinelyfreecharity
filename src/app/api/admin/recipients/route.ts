import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recipients = await prisma.recipient.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(recipients);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, website } = await request.json();

  const recipient = await prisma.recipient.create({
    data: { name, website: website || null },
  });

  return NextResponse.json(recipient);
}
