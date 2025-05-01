import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  try {
    const { company_name, start_date, end_date, review_source } = await request.json();

    if (!company_name || !start_date || !end_date || !review_source) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Initialize Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      
      // Navigate to Capterra and fetch reviews
      await page.goto(`https://www.capterra.com/search?term=${encodeURIComponent(company_name)}`);
      
      // Add your review scraping logic here
      const reviews = await page.evaluate(() => {
        // Implement review scraping logic
        return [];
      });

      return NextResponse.json({ reviews });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews.' },
      { status: 500 }
    );
  }
}
