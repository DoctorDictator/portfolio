"use client";

import { useEffect, useState } from "react";
import Title from "@/components/ui/Title";
import { Button } from "@radix-ui/themes";
import { ExternalLinkIcon, DownloadIcon } from "@radix-ui/react-icons";
import { bricolage_grotesque, inter } from "@/utils/fonts";

export default function ResumeClient({ token }: { token: string | null }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [requestStatus, setRequestStatus] = useState<null | string>(null);

  // Google Docs Resume Info
  const googleDocId = "1Cerwj5KEqGLdWvcRA3rzCzDd_96w9hi2";
  const embedUrl = `https://docs.google.com/document/d/${googleDocId}/preview`;
  const editUrl = `https://docs.google.com/document/d/${googleDocId}/edit`;

  const handleDownload = () => {
    const downloadUrl = `https://docs.google.com/document/d/${googleDocId}/export?format=pdf`;
    window.open(downloadUrl, "_blank");
  };

  // Check access by token on mount
  useEffect(() => {
    async function checkAccess() {
      setLoading(true);
      try {
        if (token) {
          const res = await fetch(`/api/resume/check-access/${token}`);
          const data = await res.json();
          setAllowed(Boolean(data.allowed));
        }
      } finally {
        setLoading(false);
      }
    }
    checkAccess();
  }, [token]);

  // Check access by email after form submit
  const handleEmailAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/resume/check-access/dummy?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      setAllowed(Boolean(data.allowed));
      if (!data.allowed) {
        setRequestStatus(
          "This email does not have access. Please request access first."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus(null);
    const res = await fetch("/api/resume/request-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setRequestStatus(
      data.message ||
        "Request sent. Your request will be approved within 24 hours."
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div
          className={`text-lg text-gray-600 dark:text-gray-300 ${bricolage_grotesque}`}
        >
          Loading...
        </div>
      </div>
    );

  if (!allowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
        <div className="w-full max-w-md px-6 py-10 rounded-xl shadow-xl bg-white/80 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col items-center gap-6">
          <Title title="Resume Access" />
          <p
            className={`mb-2 text-gray-600 dark:text-gray-300 text-center ${inter}`}
          >
            You do not have permission to view this resume.
            <br />
            Enter your email to check if you have access, or request access
            below.
          </p>

          {/* Check access by email */}
          <form
            onSubmit={handleEmailAccess}
            className="flex flex-col items-center gap-3 w-full"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
            />
            <button
              type="submit"
              className={`w-full bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition font-semibold ${bricolage_grotesque}`}
            >
              Check Access
            </button>
          </form>

          {/* Request access */}
          <form
            onSubmit={handleRequestAccess}
            className="flex flex-col items-center gap-3 w-full"
          >
            <button
              type="submit"
              className={`w-full bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600 transition font-semibold ${bricolage_grotesque}`}
              disabled={!email}
            >
              Request Access
            </button>
          </form>

          {requestStatus && (
            <p className="mt-2 text-sm text-gray-500 text-center">
              {requestStatus}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Resume view (Google Docs embed)
  return (
    <div className="min-h-screen pt-24 pb-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
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
            style={{ aspectRatio: "8.5/11" }}
          >
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              style={{ minHeight: "80vh", width: "100%" }}
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
