"use client";

import Title from "@/components/ui/Title";
import Link from "next/link";
import GitHubCalendar from "react-github-calendar";
import { useMemo } from "react";

export default function CodingPlatforms() {
  // Limit to the latest full year (52 weeks)
  const until = useMemo(
    () => new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    []
  );

  return (
    <div className="w-2/3 max-lg:w-full max-sm:w-full flex flex-col items-center mt-4 pb-8 gap-12">
      {/* GitHub Contributions */}
      <div className="w-full flex flex-col items-center gap-4">
        <Title title="GitHub Contributions" />
        <div
          className="
            w-full
            overflow-x-auto
            overflow-y-hidden
            px-4
            py-3
            sm:px-6
            md:px-8
            lg:px-10
            [scrollbar-width:thin]
            [scrollbar-color:theme(colors.violet.400)_transparent]
          "
        >
          {/* Inner wrapper expands horizontally so scroll bar works */}
          <div className="w-max min-w-full flex justify-center">
            <Link
              href={"https://github.com/DoctorDictator"}
              target="_blank"
              className="inline-block"
            >
              <GitHubCalendar
                username="DoctorDictator"
                until={until} // ensures Oct→Oct coverage
                blockSize={10}
                blockMargin={3}
                fontSize={12}
                weekStart={1}
                hideTotalCount={true}
                showWeekdayLabels={false} // hide week labels
                theme={{
                  light: [
                    "#ebedf0",
                    "#9ec8ff",
                    "#5aa6ff",
                    "#2f7ae5",
                    "#1f5bb5",
                  ],
                  dark: ["#161b22", "#2b5ea8", "#1f5bb5", "#18468a", "#133a72"],
                }}
              />
            </Link>
          </div>
        </div>

        {/* Scroll hint for mobile */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:hidden px-4 text-center">
          👉 Swipe left/right to see the full year of contributions
        </div>
      </div>

      {/* LeetCode Contributions */}
      {/* <div className="w-full flex flex-col items-center gap-4">
        <Title title="LeetCode Submissions" />
        <Link href={"https://leetcode.com/harshshishodia"} target="_blank">
          <LeetCodeCalendar username="harshshishodia" />
        </Link>
      </div> */}

      {/* Codeforces Contributions */}
      {/* <div className="w-full flex flex-col items-center gap-4">
        <Title title="Codeforces Submissions" />
        <Link
          href={"https://codeforces.com/profile/drdictator"}
          target="_blank"
        >
          <CodeforcesCalendar username="drdictator" />
        </Link>
      </div> */}
    </div>
  );
}
