import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { charityName, website, description, reason, submitterName, submitterEmail } = body;

    // Validate required field
    if (!charityName || charityName.trim().length === 0) {
      return NextResponse.json(
        { error: "Charity name is required" },
        { status: 400 }
      );
    }

    // Create submission
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

    return NextResponse.json({
      success: true,
      message: "Thank you for your submission!",
      id: submission.id,
    });
  } catch (error) {
    console.error("Charity submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit charity request" },
      { status: 500 }
    );
  }
}
