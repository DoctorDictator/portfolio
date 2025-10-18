"use client";

import { Button } from "@radix-ui/themes";
import { ExternalLinkIcon, DownloadIcon } from "@radix-ui/react-icons";
import Title from "@/components/ui/Title";

export default function ResumePage() {
  // Removed unused viewMode state

  // Convert the edit link to embed link
  const googleDocId = "1Cerwj5KEqGLdWvcRA3rzCzDd_96w9hi2";
  const embedUrl = `https://docs.google.com/document/d/${googleDocId}/preview`;
  const editUrl = `https://docs.google.com/document/d/${googleDocId}/edit`;

  const handleDownload = () => {
    const downloadUrl = `https://docs.google.com/document/d/${googleDocId}/export?format=pdf`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title title="Resume" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Google Docs Resume
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-8">
          <Button
            variant="soft"
            onClick={() => window.open(editUrl, "_blank")}
            className="flex items-center gap-2"
          >
            <ExternalLinkIcon />
            Open in Google Docs
          </Button>
          <Button
            variant="soft"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <DownloadIcon />
            Download PDF
          </Button>
        </div>

        {/* Google Docs Embed */}
        <div className="w-full flex justify-center">
          <div
            className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{ aspectRatio: "8.5/11" }} // A4 aspect ratio
          >
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              style={{
                minHeight: "80vh",
                width: "100%",
              }}
              title="Harsh Shishodia Resume"
              allowFullScreen
            />
          </div>
        </div>

        {/* Mobile Notice */}
        <div className="text-center mt-6 sm:hidden">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            For better viewing experience on mobile, tap &quot;Open in Google
            Docs&quot; above
          </p>
        </div>
      </div>
    </div>
  );
}
