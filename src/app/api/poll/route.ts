import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildFingerprint } from "@/lib/fingerprint";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  const poll = await prisma.poll.findFirst({
    where: { isActive: true },
    include: {
      options: {
        include: { _count: { select: { votes: true } } },
      },
    },
  });

  if (!poll) {
    return NextResponse.json(null);
  }

  // Get or create cookie UUID
  const cookieStore = await cookies();
  let cookieUuid = cookieStore.get("gfc_uid")?.value;
  if (!cookieUuid) {
    cookieUuid = uuidv4();
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  const fingerprint = buildFingerprint(cookieUuid, ip, ua);

  // Check participation limit
  const limit = await prisma.participationLimit.findUnique({
    where: { fingerprint_pollId: { fingerprint, pollId: poll.id } },
  });

  const alreadyVoted = limit ? limit.expiresAt > new Date() : false;
  const totalVotes = poll.options.reduce((sum, o) => sum + o._count.votes, 0);

  const response = NextResponse.json({
    id: poll.id,
    question: poll.question,
    options: poll.options,
    totalVotes,
    alreadyVoted,
    nextAvailable: alreadyVoted ? limit?.expiresAt.toISOString() : undefined,
  });

  // Set cookie
  response.cookies.set("gfc_uid", cookieUuid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 365 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
