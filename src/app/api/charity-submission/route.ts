import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { charityName, website, description, reason, submitterName, submitterEmail } = body;

    if (!charityName || typeof charityName !== "string" || charityName.trim().length === 0) {
      return NextResponse.json({ error: "Charity name is required" }, { status: 400 });
    }

    if (charityName.trim().length > 200) {
      return NextResponse.json({ error: "Charity name is too long" }, { status: 400 });
    }

    const submission = await prisma.charitySubmission.create({
      data: {
        charityName: charityName.trim(),
        website: website?.trim() || null,
        description: description?.trim() || null,
        reason: reason?.trim() || null,
        submitterName: submitterName?.trim() || null,
        submitterEmail: submitterEmail?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch {
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
