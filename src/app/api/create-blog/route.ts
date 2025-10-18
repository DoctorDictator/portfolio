import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export async function POST(req: NextRequest) {
  // Require an authenticated user
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;
  if (!user?.email) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    let title: string | null = null;
    let content: string | null = null;
    let image_public_id: string | null = null;

    // Support both JSON and multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      title = (body?.title ?? "").toString().trim();
      content = (body?.content ?? "").toString().trim();
      image_public_id = (body?.image_public_id ?? null)?.toString() || null;
    } else if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      title = form.get("title")?.toString().trim() ?? null;
      content = form.get("content")?.toString().trim() ?? null;
      image_public_id = form.get("image_public_id")?.toString() ?? null;
    }

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    // Author: prefer name, fallback to email
    const author = user?.name ?? user?.email ?? "Unknown";

    await prisma.blog.create({
      data: {
        title,
        content,
        author,
        image_public_id: image_public_id ?? "",
      },
    });

    return NextResponse.json(
      { success: true, message: "Blog published successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error creating blog:", err);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
