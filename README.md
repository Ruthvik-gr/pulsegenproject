# Pulse - Company Review Analysis Platform

A web-based platform that analyzes and visualizes company reviews from various sources, providing insights into employee sentiment and company performance.

## Features

- Search and analyze company reviews from capterra
- Visualize review trends over time
- Filter reviews by date range and source
- User-friendly interface with modern design
- Real-time review data processing

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS 
- **UI Framework**: React 18
- **Animation**: Framer Motion
- **Date Handling**: date-fns
- **Web Scraping**: Puppeteer
- **Development Tools**: TypeScript, ESLint, PostCSS

## Installation Guide

1. Clone the repository:
```bash
git clone https://github.com/Ruthvik-gr/pulsegenproject.git
cd pulse
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Usage

To analyze company reviews, Enter the following information in the input fields:

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