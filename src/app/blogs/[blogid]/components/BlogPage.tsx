"use client";

import Image from "next/image";
import React from "react";

type ImageUrl = {
  url: string;
};

const BlogPage = ({ url }: ImageUrl) => {
  return (
    <Image
      width={900}
      height={900}
      src={url}
      alt="Blog Image"
      style={{ borderRadius: 10, width: "100%", height: "auto" }}
    />
  );
};

export default BlogPage;
