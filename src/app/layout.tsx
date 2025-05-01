import type { Metadata } from "next";
import '../app/globals.css'

export const metadata: Metadata = {
  title: "SaaS Review Scraper",
  description: "Analyze and scrape reviews from your favorite SaaS platforms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-screen bg-dark-background text-gray-200">
        {children}
      </body>
    </html>
  );
}
