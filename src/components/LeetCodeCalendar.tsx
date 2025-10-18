"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useDarkMode } from "@/hooks/useDarkMode";

interface LeetCodeCalendarProps {
  username: string;
}

interface SubmissionData {
  date: string;
  count: number;
}

export default function LeetCodeCalendar({ username }: LeetCodeCalendarProps) {
  const [data, setData] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      if (!username) return;

      setLoading(true);
      setMessage("");

      try {
        console.log(`Fetching real LeetCode data for: ${username}`);

        const response = await fetch("/api/leetcode/calendar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log("LeetCode API Response:", result);

        if (!cancelled && Array.isArray(result.data)) {
          setData(result.data);
          setSource(result.source || "unknown");
          setMessage(result.message || "");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        if (!cancelled) {
          const emptyData = generateEmptyData();
          setData(emptyData);
          setSource("error");
          setMessage("Failed to load data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [username]);

  const generateEmptyData = useCallback((): SubmissionData[] => {
    const out: SubmissionData[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      out.push({ date: d.toISOString().split("T")[0], count: 0 });
    }
    return out;
  }, []);

  const getIntensityLevel = useCallback((count: number): number => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 8) return 3;
    return 4;
  }, []);

  const getColor = useCallback(
    (level: number): string => {
      const colors = {
        light: ["#ebedf0", "#ffa116", "#ff7b00", "#ff5722", "#d32f2f"],
        dark: ["#232a34", "#ffa116", "#ff7b00", "#ff5722", "#d32f2f"],
      };
      return isDarkMode ? colors.dark[level] : colors.light[level];
    },
    [isDarkMode]
  );

  const weeks = useMemo(() => {
    const w: JSX.Element[] = [];
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
            style={{
              backgroundColor: getColor(level),
              margin: "1.5px",
              border:
                level === 0 && isDarkMode
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
            }}
            title={`${dayData.date}: ${dayData.count} submissions`}
          />
        );
      }

      w.push(
        <div key={week} className="flex flex-col gap-0">
          {days}
        </div>
      );
    }
    return w;
  }, [data, isDarkMode, getColor, getIntensityLevel]);

  const totalSubmissions = useMemo(() => {
    return data.reduce((sum, day) => sum + day.count, 0);
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
        <div className="text-xs text-gray-500">
          Fetching real LeetCode data...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-0 overflow-x-auto max-w-full min-h-[90px]">
        {weeks}
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
        {totalSubmissions > 0 && (
          <span className="ml-2">
            ({totalSubmissions} submissions this year)
          </span>
        )}
      </div>

      <div className="text-[10px] text-gray-400 mt-1 text-center">
        {source === "leetcode-real" && (
          <span className="text-green-600 dark:text-green-400">
            ✓ Live LeetCode data
          </span>
        )}
        {source === "empty" && (
          <span className="text-yellow-600 dark:text-yellow-400">
            ⚠ Unable to fetch data
          </span>
        )}
        {source === "error" && (
          <span className="text-red-600 dark:text-red-400">
            ⚠ Error loading data
          </span>
        )}
      </div>

      {message && (
        <div className="text-[9px] text-gray-500 mt-1 text-center max-w-xs">
          {message}
        </div>
      )}
    </div>
  );
}
