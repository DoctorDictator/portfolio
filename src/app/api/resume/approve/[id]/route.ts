import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is missing. Cannot approve resume request.");
    return NextResponse.json(
      { success: false, message: "Database connection not configured." },
      { status: 503 }
    );
  }

  const { id } = params;
  const request = await prisma.resumeAccessRequest.findUnique({
    where: { id },
  });

  if (!request) {
    return NextResponse.json(
      { success: false, message: "Request not found" },
      { status: 404 }
    );
  }

  await prisma.resumeAccessRequest.update({
    where: { id },
    data: { status: "approved", approvedAt: new Date() },
  });

  // No email is sent here

  return NextResponse.redirect(
    `https://shishodia.vercel.app/resume?token=${id}`
  );
}
