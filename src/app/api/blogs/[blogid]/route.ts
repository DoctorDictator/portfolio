import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/blogs/[blogid]
export async function GET(
  req: NextRequest,
  { params }: { params: { blogid: string } }
) {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is missing. Cannot fetch blog entry.");
    return NextResponse.json(
      { success: false, message: "Database connection not configured." },
      { status: 503 }
    );
  }

  const { blogid } = params;

  if (!blogid) {
    return NextResponse.json(
      { success: false, message: "Blog ID is required." },
      { status: 400 }
    );
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogid },
      select: {
        id: true,
        title: true,
        author: true,
        createdAt: true,
        image_public_id: true,
        content: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: blog }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, message: "Error while fetching blog." },
      { status: 500 }
    );
  }
}
