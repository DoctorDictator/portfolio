import { prisma } from "@/lib/prisma"; // adjust path if needed
import BlogCard from "./BlogCard";

type Blog = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

export async function getBlogs(): Promise<Blog[]> {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
    return blogs;
  } catch (error) {
    console.error(`Error while fetching the blogs: ${error}`);
    return [];
  }
}

async function BlogList() {
  const blogs = await getBlogs();

  return (
    <div className="w-full px-64 max-[1025px]:px-0 max-[1285px]:px-0 max-sm:px-2 flex flex-col gap-6 items-center mt-4 pb-8 max-sm:overflow-hidden">
      {blogs.length === 0 ? (
        <div className="text-gray-500">No blogs found.</div>
      ) : (
        blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            title={blog.title}
            createdAt={blog.createdAt.toISOString()}
            content={blog.content}
            id={blog.id}
          />
        ))
      )}
    </div>
  );
}

export default BlogList;
