import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  reviews: {
    title: string;
    review: string;
    date: string;
    reviewer?: string;
    rating?: number;
  }[];
}

export default function ReviewList({ reviews }: Props) {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(reviews);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  useEffect(() => {
    setFiltered(reviews);
  }, [reviews]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    filterReviews(query, selectedRating);
  };

  const handleRatingFilter = (rating: number | null) => {
    setSelectedRating(rating);
    filterReviews(search, rating);
  };

  const filterReviews = (query: string, rating: number | null) => {
    let results = [...reviews];
    if (query.trim()) {
      results = results.filter(review =>
        review.title.toLowerCase().includes(query.toLowerCase()) ||
        review.review.toLowerCase().includes(query.toLowerCase()) ||
        (review.reviewer && review.reviewer.toLowerCase().includes(query.toLowerCase()))
      );
    }
    if (rating !== null) {
      results = results.filter(review => review.rating === rating);
    }
    setFiltered(results);
  };

  return (
    <div className="bg-dark-surface rounded-lg shadow-dark max-w-4xl mx-auto p-6 border border-dark-border">
      {/* Search and Filter */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-200 mb-4">Review Results</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search reviews..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-surface border border-dark-border text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex items-center bg-dark-accent/30 px-4 py-3 rounded-lg shadow-dark">
            <span className="text-sm font-medium text-gray-300 mr-3">Filter by rating:</span>
            <div className="flex space-x-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(selectedRating === rating ? null : rating)}
                  className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold ${
                    selectedRating === rating
                      ? 'bg-primary-700 text-white shadow-dark'
                      : 'bg-dark-surface text-gray-300 border border-dark-border hover:bg-dark-accent'
                  } transition-colors`}
                >
                  {rating}
                </button>
              ))}
              {selectedRating !== null && (
                <button
                  onClick={() => handleRatingFilter(null)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4">
          <span className="text-sm text-gray-400">
            Showing {filtered.length} of {reviews.length} reviews
            {selectedRating !== null && (
              <span className="ml-1">
                with {selectedRating} star{selectedRating !== 1 ? 's' : ''}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark-accent/30 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-200 mb-2">No Results Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">Try adjusting your search terms or clearing the filters to see more reviews</p>
            <button 
              onClick={() => {
                setSearch('');
                setSelectedRating(null);
                setFiltered(reviews);
              }}
              className="mt-4 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <div className="border border-dark-border bg-dark-surface/80 rounded-lg p-4 hover:shadow-dark transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    {/* Left side - Stars and review title */}
                    <div className="flex items-center">
                      {/* Star rating with gold color */}
                      <div className="flex mr-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span 
                            key={i} 
                            className={i < (review.rating || 0) ? "text-primary-400" : "text-gray-700"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      
                      {/* Review title in quotes - show review content if title is empty */}
                      <p className="text-gray-300 font-medium">
                        {review.title ? 
                          `"${review.title}"` : 
                          review.review ? 
                            `"${review.review.substring(0, 50)}${review.review.length > 50 ? '...' : ''}"` : 
                            '"No review content"'
                        }
                      </p>
                    </div>
                    
                    {/* Right side - Reviewer name and date */}
                    <div className="flex items-center">
                      <span className="font-medium text-gray-400 mr-3">{review.reviewer}</span>
                      <div className="flex items-center bg-dark-accent/30 px-3 py-1 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
