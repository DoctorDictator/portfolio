"use client";

import { useState, useEffect, useCallback } from "react";
import { useDarkMode } from "@/hooks/useDarkMode";

interface CodeforcesCalendarProps {
  username: string;
}
interface ContestData {
  date: string;
  count: number;
}
interface CodeforcesSubmission {
  creationTimeSeconds: number;
  verdict?: string;
  problem: { name: string; rating?: number };
}

export default function CodeforcesCalendar({
  username,
}: CodeforcesCalendarProps) {
  const [data, setData] = useState<ContestData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();

  const generateEmptyData = useCallback((): ContestData[] => {
    const out: ContestData[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      out.push({ date: d.toISOString().split("T")[0], count: 0 });
    }
    return out;
  }, []);

  const processSubmissions = useCallback(
    (submissions: CodeforcesSubmission[]): ContestData[] => {
      const dailyData: Record<string, number> = {};
      submissions.forEach((s) => {
        const date = new Date(s.creationTimeSeconds * 1000)
          .toISOString()
          .split("T")[0];
        dailyData[date] = (dailyData[date] ?? 0) + 1;
      });

      const out: ContestData[] = [];
      const today = new Date();
      for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split("T")[0];
        out.push({ date: ds, count: dailyData[ds] ?? 0 });
      }
      return out;
    },
    []
  );

  const fetchCodeforcesData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
      );
      const result = await response.json();
      if (result.status === "OK") {
        const submissions = processSubmissions(
          result.result as CodeforcesSubmission[]
        );
        setData(submissions);
      } else {
        throw new Error(`Codeforces API error: ${result.comment}`);
      }
    } catch (err) {
      console.error("Failed to fetch Codeforces data:", err);
      setData(generateEmptyData());
    } finally {
      setLoading(false);
    }
  }, [username, processSubmissions, generateEmptyData]);

  useEffect(() => {
    fetchCodeforcesData();
  }, [fetchCodeforcesData]);

  const getIntensityLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  const getColor = (level: number): string => {
    const colors = {
      light: ["#ebedf0", "#1976d2", "#1565c0", "#0d47a1", "#0a369d"],
      dark: ["#161b22", "#1976d2", "#1565c0", "#0d47a1", "#0a369d"],
    };
    return isDarkMode ? colors.dark[level] : colors.light[level];
  };

  const renderWeeks = () => {
    const weeks: JSX.Element[] = [];
    const weeksCount = Math.ceil(data.length / 7);
    for (let week = 0; week < weeksCount; week++) {
      const days: JSX.Element[] = [];
      for (let day = 0; day < 7; day++) {
        const idx = week * 7 + day;
        const dayData = data[idx];
        if (!dayData) continue;
        const level = getIntensityLevel(dayData.count);
        days.push(
          <div
            key={`${week}-${day}`}
            className="w-[10px] h-[10px] rounded-sm transition-all hover:scale-110 cursor-pointer"
            style={{ backgroundColor: getColor(level), margin: "1.5px" }}
            title={`${dayData.date}: ${dayData.count} submissions`}
          />
        );
      }
      weeks.push(
        <div key={week} className="flex flex-col gap-0">
          {days}
        </div>
      );
    }
    return weeks;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-0 overflow-x-auto max-w-full">
        {renderWeeks()}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: getColor(level) }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
