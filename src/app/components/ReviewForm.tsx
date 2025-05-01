"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReviewList from "./ReviewList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ReviewForm() {
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [source, setSource] = useState("capterra");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  const sources = [
    { value: "capterra", label: "Capterra" }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!company || !startDate || !endDate) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, startDate, endDate, source }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch reviews");
      setReviews(data.reviews || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-dark-surface rounded-2xl shadow-dark p-8 border border-dark-border hover:shadow-lg transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-2">SaaS Review Scraper</h2>
          <p className="text-gray-400">Enter company and date range to fetch and analyze software reviews</p>
        </div>

        {error && (
          <motion.div
            className="mb-6 px-4 py-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400"
            animate={{ x: [-5, 5, -5, 0] }}
            transition={{ duration: 0.4 }}
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="company" className="text-sm text-gray-300 font-medium">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company"
              placeholder="e.g., Canva, Notion"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 w-full bg-dark-surface border border-dark-border text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-600/30 focus:outline-none"
            />
          </div>

          <div>
            <Label htmlFor="startDate" className="text-sm text-gray-300 font-medium">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full bg-dark-surface border border-dark-border text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-600/30 focus:outline-none"
            />
          </div>

          <div>
            <Label htmlFor="endDate" className="text-sm text-gray-300 font-medium">
              End Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full bg-dark-surface border border-dark-border text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-600/30 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="source" className="text-sm text-gray-300 font-medium">
              Review Source
            </Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="mt-1 w-full bg-dark-surface border border-dark-border text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-600/30 focus:outline-none">
                <span className="capitalize">{source}</span>
              </SelectTrigger>
              <SelectContent className="bg-dark-surface border border-dark-border text-gray-200">
                {sources.map((src) => (
                  <SelectItem key={src.value} value={src.value} className="hover:bg-dark-accent">
                    {src.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            className="bg-gradient-to-r from-primary-700 to-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-dark hover:shadow-lg transition-all"
            disabled={loading || !company || !startDate || !endDate}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Fetching...
              </span>
            ) : (
              'Fetch Reviews'
            )}
          </Button>
        </div>
      </motion.form>

      {reviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <ReviewList reviews={reviews} />
        </motion.div>
      )}
    </div>
  );
}
