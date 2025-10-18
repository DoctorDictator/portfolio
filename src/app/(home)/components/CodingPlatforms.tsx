import Title from "@/components/ui/Title";
import Link from "next/link";
import GitHubCalendar from "react-github-calendar";
// import LeetCodeCalendar from "@/components/LeetCodeCalendar";
// import CodeforcesCalendar from "@/components/CodeforcesCalendar";

export default function CodingPlatforms() {
  return (
    <div className="w-2/3 max-lg:w-full max-sm:w-full flex flex-col items-center mt-4 pb-8 gap-12">
      {/* GitHub Contributions */}
      <div className="w-full flex flex-col items-center gap-4">
        <Title title="GitHub Contributions" />
        <div className="max-sm:w-full max-sm:overflow-x-auto max-sm:flex max-sm:justify-center">
          <Link
            href={"https://github.com/DoctorDictator"}
            target="_blank"
            className="inline-block"
          >
            <GitHubCalendar
              username="DoctorDictator"
              blockSize={10}
              blockMargin={3}
              theme={{
                light: ["#1e1e2f", "#5a3e7a", "#7e5aa2", "#a87cc3", "#d9a9e6"],
                dark: ["#1e1e2f", "#5a3e7a", "#7e5aa2", "#a87cc3", "#d9a9e6"],
              }}
            />
          </Link>
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
