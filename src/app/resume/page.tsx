import { Suspense } from "react";
import ResumeClient from "./components/ResumeClient";

export default function ResumePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams?.token ?? null;

  // Client child uses fetch + state; wrap in Suspense for safety
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading…
        </div>
      }
    >
      <ResumeClient token={token} />
    </Suspense>
  );
}
