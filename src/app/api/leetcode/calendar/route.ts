import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour
export const runtime = "nodejs";

type Day = { date: string; count: number };

function generateEmptyData(): Day[] {
  const out: Day[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push({ date: d.toISOString().split("T")[0], count: 0 });
  }
  return out;
}

async function fetchFromLeetCodeGraphQL(
  username: string
): Promise<Day[] | null> {
  try {
    const query = `
      query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
          userCalendar(year: $year) {
            submissionCalendar
          }
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
          year: new Date().getFullYear(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL API failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.data?.matchedUser?.userCalendar?.submissionCalendar) {
      const calendar = JSON.parse(
        data.data.matchedUser.userCalendar.submissionCalendar
      );
      return processSubmissionCalendar(calendar);
    }

    throw new Error("No calendar data in response");
  } catch (error) {
    console.log("GraphQL API failed:", error);
    return null;
  }
}

async function fetchFromAlternativeAPI(
  username: string
): Promise<Day[] | null> {
  const apis = [
    `https://leetcode-stats-api.herokuapp.com/${username}`,
    `https://alfa-leetcode-api.onrender.com/${username}/calendar`,
    `https://leetcode-api-faisalshohag.vercel.app/${username}`,
  ];

  for (const apiUrl of apis) {
    try {
      console.log(`Trying API: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error(`API ${apiUrl} responded with ${response.status}`);
      }

      const data = await response.json();
      console.log(`API Response from ${apiUrl}:`, data);

      // Try different response formats
      if (data.submissionCalendar) {
        return processSubmissionCalendar(data.submissionCalendar);
      }

      if (data.data?.submissionCalendar) {
        return processSubmissionCalendar(data.data.submissionCalendar);
      }

      if (data.calendar) {
        return processAlternativeCalendar(data.calendar);
      }

      // Check if it's an array of submissions
      if (
        Array.isArray(data.recentSubmissions) ||
        Array.isArray(data.submissions)
      ) {
        const submissions = data.recentSubmissions || data.submissions;
        return processSubmissionsArray(submissions);
      }
    } catch (error) {
      console.log(`API ${apiUrl} failed:`, error);
      continue;
    }
  }

  return null;
}

function processSubmissionCalendar(calendar: Record<string, number>): Day[] {
  const data: Day[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const timestamp = Math.floor(date.getTime() / 1000);
    const dateStr = date.toISOString().split("T")[0];

    data.push({
      date: dateStr,
      count: calendar[timestamp] || 0,
    });
  }

  return data;
}

interface CalendarItem {
  date: string;
  count?: number;
  submissions?: number;
  [key: string]: unknown;
}

function processAlternativeCalendar(
  calendar: Record<string, unknown> | CalendarItem[]
): Day[] {
  const data: Day[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Look for the date in the calendar object
    let dayData: CalendarItem | undefined;

    if (
      !Array.isArray(calendar) &&
      typeof calendar === "object" &&
      calendar !== null
    ) {
      dayData = (calendar as Record<string, CalendarItem>)[dateStr] as
        | CalendarItem
        | undefined;
    } else if (Array.isArray(calendar)) {
      dayData = (calendar as CalendarItem[]).find(
        (item: CalendarItem) => item.date === dateStr
      );
    }

    const count = dayData?.count || dayData?.submissions || 0;

    data.push({
      date: dateStr,
      count: count,
    });
  }

  return data;
}

interface Submission {
  timestamp?: number;
  submitTime?: string | number;
  date?: string;
  [key: string]: unknown;
}

function processSubmissionsArray(submissions: Submission[]): Day[] {
  const dailyCount: { [date: string]: number } = {};

  // Count submissions per day
  submissions.forEach((submission: Submission) => {
    let date: string;

    if (submission.timestamp) {
      date = new Date(submission.timestamp * 1000).toISOString().split("T")[0];
    } else if (submission.submitTime) {
      date = new Date(submission.submitTime).toISOString().split("T")[0];
    } else if (submission.date) {
      date = submission.date;
    } else {
      return;
    }

    dailyCount[date] = (dailyCount[date] || 0) + 1;
  });

  const data: Day[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    data.push({
      date: dateStr,
      count: dailyCount[dateStr] || 0,
    });
  }

  return data;
}

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username || typeof username !== "string") {
      return new Response(JSON.stringify({ error: "username is required" }), {
        status: 400,
      });
    }

    console.log(`Fetching real LeetCode data for: ${username}`);

    // Try GraphQL API first
    let realData = await fetchFromLeetCodeGraphQL(username);

    // If GraphQL fails, try alternative APIs
    if (!realData) {
      realData = await fetchFromAlternativeAPI(username);
    }

    if (realData && realData.some((day) => day.count > 0)) {
      console.log("Successfully got real LeetCode data");
      return new Response(
        JSON.stringify({
          data: realData,
          source: "leetcode-real",
          message: "Real LeetCode submission data",
        }),
        { status: 200 }
      );
    }

    // If all APIs fail, return empty data
    console.log("All APIs failed, returning empty data");
    return new Response(
      JSON.stringify({
        data: generateEmptyData(),
        source: "empty",
        message: "Unable to fetch LeetCode data - APIs unavailable",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);

    return new Response(
      JSON.stringify({
        data: generateEmptyData(),
        source: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Error fetching LeetCode data",
      }),
      { status: 200 }
    );
  }
}
