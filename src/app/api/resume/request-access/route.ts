import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { EmailTemplate } from "@/components/email-template";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { success: false, message: "Email required" },
      { status: 400 }
    );
  }

  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is missing. Cannot record resume access request.");
    return NextResponse.json(
      {
        success: false,
        message: "Database connection not configured. Please try again later.",
      },
      { status: 503 }
    );
  }

  // Store request in DB
  const request = await prisma.resumeAccessRequest.create({
    data: { email, ip },
  });

  if (!resend) {
    console.warn("RESEND_API_KEY is missing. Skipping email send.");
    return NextResponse.json(
      {
        success: true,
        message:
          "Request saved, but email notification could not be sent (missing RESEND_API_KEY).",
      },
      { status: 200 }
    );
  }

  // Send email to you for approval
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: ["harshxshishodia@gmail.com"],
    subject: "Resume Access Request",
    react: EmailTemplate({
      Email: email,
      Message: `Resume access requested. Approve: https://shishodia.vercel.app/api/resume/approve/${request.id}`,
    }),
  });

  return NextResponse.json({
    success: true,
    message:
      "Request sent. Await approval. Your request will be approved within 24 hours.",
  });
}
