"use client";
import { Avatar, Link } from "@radix-ui/themes";
import { formatDate } from "@/utils/formatdate";

interface BlogHeaderProps {
  author: string;
  createdAt: string;
  readingTime: string;
}

export default function BlogHeader({
  author,
  createdAt,
  readingTime,
}: BlogHeaderProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <Avatar src="https://avatars.githubusercontent.com/u/182363405?v=4" fallback="A" radius="full" size="2" />
      <Link
        href="/about"
        underline="none"
        className="text-sm text-black dark:text-white"
      >
        {author}
      </Link>
      <p className="text-sm max-sm:text-xs">{formatDate(createdAt)}</p>
      <p className="text-sm max-sm:text-xs">{readingTime}</p>
    </div>
  );
}
