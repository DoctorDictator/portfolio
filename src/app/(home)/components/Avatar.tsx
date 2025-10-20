import React from "react";
import { Link, Avatar as Picture } from "@radix-ui/themes";

const Avatar = () => {
  return (
    <Link href="https://x.com/harshshishodia_" target="_blank">
      <Picture src="https://avatars.githubusercontent.com/u/182363405?v=4" fallback="A" size="6" radius="full" />
    </Link>
  );
};

export default Avatar;
