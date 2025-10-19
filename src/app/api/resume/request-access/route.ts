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

  // Store request in DB
  const request = await prisma.resumeAccessRequest.create({
    data: { email, ip },
  });

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
