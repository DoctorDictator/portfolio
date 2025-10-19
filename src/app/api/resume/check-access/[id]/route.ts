import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = params.id;
  const email = req.nextUrl.searchParams.get("email");
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";

  // If no token, email, or IP, deny access
  if (!token && !email && !ip) return NextResponse.json({ allowed: false });

  // Check by token
  if (token) {
    const request = await prisma.resumeAccessRequest.findUnique({
      where: { id: token },
    });
    if (request?.status === "approved") {
      return NextResponse.json({ allowed: true });
    }
  }

  // Check by email (if provided)
  if (email) {
    const request = await prisma.resumeAccessRequest.findFirst({
      where: { email, status: "approved" },
    });
    if (request) {
      return NextResponse.json({ allowed: true });
    }
  }

  // Check by IP (if provided)
  if (ip) {
    const request = await prisma.resumeAccessRequest.findFirst({
      where: { ip, status: "approved" },
    });
    if (request) {
      return NextResponse.json({ allowed: true });
    }
  }

  // If none matched, deny access
  return NextResponse.json({ allowed: false });
}
