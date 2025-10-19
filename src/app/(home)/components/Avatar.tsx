import React from "react";
import { Link, Avatar as Picture } from "@radix-ui/themes";

const Avatar = () => {
  return (
    <Link href="https://x.com/harshshishodia_" target="_blank">
      <Picture src="/profile.jpeg" fallback="A" size="6" radius="full" />
    </Link>
  );
};

export default Avatar;
