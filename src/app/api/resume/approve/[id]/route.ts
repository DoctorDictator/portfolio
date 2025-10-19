import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
