import { NextRequest, NextResponse } from "next/server";
import { EmailTemplate } from "@/components/email-template";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email, message } = await req.json();

    // Validate email and message
    if (
      typeof email !== "string" ||
      typeof message !== "string" ||
      !email.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Email and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address format." },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["harshxshishodia@gmail.com"],
      subject: "Message from Your Portfolio",
      react: EmailTemplate({ Email: email, Message: message }),
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send email: ${error}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out! I'll get in touch soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Server error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
