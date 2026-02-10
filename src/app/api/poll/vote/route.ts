import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildFingerprint } from "@/lib/fingerprint";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const { pollId, optionId } = await request.json();

  if (!pollId || !optionId) {
    return NextResponse.json({ error: "Missing pollId or optionId" }, { status: 400 });
  }

  const cookieStore = await cookies();
  let cookieUuid = cookieStore.get("gfc_uid")?.value;
  if (!cookieUuid) {
    cookieUuid = uuidv4();
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  const fingerprint = buildFingerprint(cookieUuid, ip, ua);

  // Check existing participation
  const existing = await prisma.participationLimit.findUnique({
    where: { fingerprint_pollId: { fingerprint, pollId } },
  });

  if (existing && existing.expiresAt > new Date()) {
    return NextResponse.json({
      error: "Already participated",
      alreadyVoted: true,
      nextAvailable: existing.expiresAt.toISOString(),
    }, { status: 429 });
  }

  // Create vote
  await prisma.vote.create({
    data: { pollId, optionId, fingerprint },
  });

  // Upsert participation limit (24h)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.participationLimit.upsert({
    where: { fingerprint_pollId: { fingerprint, pollId } },
    create: { fingerprint, pollId, expiresAt },
    update: { expiresAt },
  });

  // Return updated poll
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      options: {
        include: { _count: { select: { votes: true } } },
      },
    },
  });

  const totalVotes = poll?.options.reduce((sum, o) => sum + o._count.votes, 0) || 0;

  const response = NextResponse.json({
    id: poll?.id,
    question: poll?.question,
    options: poll?.options,
    totalVotes,
    alreadyVoted: true,
    nextAvailable: expiresAt.toISOString(),
  });

  response.cookies.set("gfc_uid", cookieUuid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 365 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
