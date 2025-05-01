import { NextResponse } from "next/server";
import { scrapeCapterra } from "../../../../lib/scraper";

export async function POST(req: Request) {
  const { company, startDate, endDate } = await req.json();

  try {
    const reviews = await scrapeCapterra(company, startDate, endDate);
    return NextResponse.json({ reviews });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}
