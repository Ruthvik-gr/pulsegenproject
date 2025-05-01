import puppeteer from "puppeteer";
import {
  parseISO,
  isBefore,
  isAfter,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  format,
} from "date-fns";

type Review = {
  title: string;
  review: string;
  date: string;
  reviewer: string;
  rating: number;
};

async function convertRelativeDate(
  relativeTime: string,
  endDate: string
): Promise<string> {
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
  const referenceDate = new Date(endYear, endMonth - 1, endDay);
  let pastDate = referenceDate;

  if (relativeTime === "last year") {
    pastDate = subYears(referenceDate, 1);
  } else if (relativeTime === "last month") {
    pastDate = subMonths(referenceDate, 1);
  } else if (relativeTime === "last week") {
    pastDate = subWeeks(referenceDate, 1);
  } else if (relativeTime.includes("years ago")) {
    const yearsAgo = parseInt(relativeTime);
    if (!isNaN(yearsAgo)) {
      pastDate = subYears(referenceDate, yearsAgo);
    }
  } else if (relativeTime.includes("months ago")) {
    const monthsAgo = parseInt(relativeTime);
    if (!isNaN(monthsAgo)) {
      pastDate = subMonths(referenceDate, monthsAgo);
    }
  } else if (relativeTime.includes("days ago")) {
    const daysAgo = parseInt(relativeTime);
    if (!isNaN(daysAgo)) {
      pastDate = subDays(referenceDate, daysAgo);
    }
  } else {
    console.error("[DEBUG] Unsupported date format:", relativeTime);
    return "Invalid date";
  }

  // Format the date as YYYY-MM-DD
  const year = pastDate.getFullYear();
  const month = String(pastDate.getMonth() + 1).padStart(2, "0");
  const day = String(pastDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function scrapeCapterra(
  company: string,
  start: string,
  end: string
): Promise<Review[]> {
  console.error(`[DEBUG] Scraping Capterra for company: ${company}`);
  const reviews: Review[] = [];

  // Configure puppeteer with additional options
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920x1080",
    ],
  });

  const page = await browser.newPage();

  // Set a realistic user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // First, search for the product
    const searchUrl = `https://www.capterra.in/search/product?q=${encodeURIComponent(
      company
    )}&page=1`;
    console.error(`[DEBUG] Searching for product: ${searchUrl}`);

    await page.goto(searchUrl, {
      waitUntil: "domcontentloaded",
    });

    // Take a screenshot for debugging
    await page.screenshot({ path: "search-results.png" });
    console.error("[DEBUG] Saved search results screenshot");

    // Get the product ID from the search results
    const productData = await page.evaluate(() => {
      console.error("[DEBUG] Evaluating search results page");
      const anchorElements = document.querySelectorAll(
        "a.entry.d-flex.my-4.text-decoration-none.event"
      );
      console.error(`[DEBUG] Found ${anchorElements.length} anchor elements`);

      const links = Array.from(anchorElements).map((anchor) => {
        const href = anchor.getAttribute("href");
        console.error("[DEBUG] Found link:", href);
        return href;
      });

      if (links.length > 0) {
        const productId = links[0]
          ?.replace("/software/", "")
          .replace("/reviews/", "");
        console.error("[DEBUG] Extracted product ID:", productId);
        return productId;
      }
      return null;
    });

    if (!productData) {
      console.error("[DEBUG] No product found in search results");
      throw new Error("Product not found");
    }

    console.error(`[DEBUG] Found product ID: ${productData}`);

    // Now scrape the reviews
    const reviewsUrl = `https://www.capterra.in/reviews/${productData}?page=1&sort=most_recent`;
    console.error(`[DEBUG] Scraping reviews from: ${reviewsUrl}`);

    await page.goto(reviewsUrl, {
      waitUntil: "domcontentloaded",
    });

    const reviewsData = await page.evaluate(() => {
      console.error("[DEBUG] Evaluating reviews page");
      const reviewCards = document.querySelectorAll(
        ".i18n-translation_container.review-card"
      );
      console.error(`[DEBUG] Found ${reviewCards.length} review cards`);

      const results: {
        reviewer: string;
        rating: number;
        review: string;
        date: string;
        title: string;
      }[] = [];

      reviewCards.forEach((reviewCard) => {
        const reviewerNameElement = reviewCard.querySelector(
          ".col-lg-5 .h5.fw-bold"
        );
        const ratingSpanElement = reviewCard.querySelector(
          ".col-lg-7 .text-ash.mb-3 .star-rating-component .d-flex .ms-1"
        );
        const reviewTextElement = reviewCard.querySelector(
          ".col-lg-7 .h5.fw-bold"
        );
        const relativeDateSpanElement = reviewCard.querySelector(
          ".col-lg-7 .text-ash.mb-3 > span:nth-child(2)"
        );

        console.error("[DEBUG] Review elements found:", {
          reviewer: !!reviewerNameElement,
          rating: !!ratingSpanElement,
          review: !!reviewTextElement,
          date: !!relativeDateSpanElement,
        });

        if (reviewerNameElement && ratingSpanElement && reviewTextElement) {
          const review = {
            reviewer: reviewerNameElement.textContent?.trim() || "",
            rating: parseFloat(ratingSpanElement.textContent?.trim() || "0"),
            review: reviewTextElement.textContent?.trim() || "",
            date: relativeDateSpanElement?.textContent?.trim() || "",
            title: "",
          };
          console.error("[DEBUG] Parsed review:", review);
          results.push(review);
        }
      });

      return results;
    });

    console.error(
      `[DEBUG] Found ${reviewsData.length} reviews before date filtering`
    );

    // Convert relative dates to actual dates and filter by date range
    for (const review of reviewsData) {
      console.error("[DEBUG] Processing review date:", review.date);

      const reviewDate = await convertRelativeDate(review.date, end);
      console.error("[DEBUG] Converted date:", reviewDate);

      if (reviewDate === "Invalid date") {
        console.error("[DEBUG] Skipping review with invalid date");
        continue;
      }

      // Convert dates to local format for comparison
      const [reviewYear, reviewMonth, reviewDay] = reviewDate
        .split("-")
        .map(Number);
      const [startYear, startMonth, startDay] = start.split("-").map(Number);
      const [endYear, endMonth, endDay] = end.split("-").map(Number);

      const reviewDateObj = new Date(reviewYear, reviewMonth - 1, reviewDay);
      const startDateObj = new Date(startYear, startMonth - 1, startDay);
      const endDateObj = new Date(endYear, endMonth - 1, endDay);

      console.error("[DEBUG] Date comparison:", {
        reviewDate,
        startDate: start,
        endDate: end,
        isInRange: reviewDateObj >= startDateObj && reviewDateObj <= endDateObj,
      });

      if (reviewDateObj >= startDateObj && reviewDateObj <= endDateObj) {
        console.error("[DEBUG] Review within date range, adding to results");
        reviews.push({
          ...review,
          date: reviewDate,
        });
      } else {
        console.error("[DEBUG] Review outside date range, skipping");
      }
    }

    console.error(
      `[DEBUG] Filtered to ${reviews.length} reviews within date range`
    );
  } catch (error) {
    console.error("[ERROR] Error during scraping:", error);
  } finally {
    await browser.close();
  }
  return reviews;
}



// Handle vague dates like "Jan 2024"
function tryParseDate(text: string): string | null {
  try {
    const d = new Date(text);
    return d.toISOString().split("T")[0];
  } catch {
    return null;
  }
}
