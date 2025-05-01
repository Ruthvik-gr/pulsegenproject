# Pulse - Company Review Analysis Platform

A web-based platform that analyzes and visualizes company reviews from various sources, providing insights into employee sentiment and company performance.

## Features

- Search and analyze company reviews from multiple sources
- Visualize review trends over time
- Filter reviews by date range and source
- User-friendly interface with modern design
- Real-time review data processing

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **UI Framework**: React 18
- **Animation**: Framer Motion
- **Date Handling**: date-fns
- **Web Scraping**: Puppeteer
- **Development Tools**: TypeScript, ESLint, PostCSS

## Installation Guide

1. Clone the repository:
```bash
git clone [repository-url]
cd pulse
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your configuration:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Usage

To analyze company reviews, send a POST request with the following structure:

```json
{
  "company_name": "facebook",
  "start_date": "2009-06-02",
  "end_date": "2025-05-01",
  "review_source": "Capterra"
}
```

## Note on Data Sources

Due to security restrictions and website protections, we currently support reviews from Capterra. Other sources like G2 were not accessible due to their security measures.

