import ReviewForm from "../app/components/ReviewForm"

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-background">
      {/* Header */}
      <header className="w-full bg-dark-surface/90 backdrop-blur-sm border-b border-dark-border sticky top-0 z-10 shadow-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl">SR</div>
            <h2 className="text-xl font-bold text-gray-200">SaaS Review Scraper</h2>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-blue-400">
                SaaS Review Scraper
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Analyze and scrape reviews from your favorite SaaS platforms with our powerful, easy-to-use tool.
              Get valuable insights in seconds.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: "🔍",
                title: "Powerful Search",
                description: "Find exactly what you're looking for with our advanced filtering capabilities."
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Get results in seconds, not minutes. Our scraper is optimized for speed."
              },
              {
                icon: "📊",
                title: "Detailed Analysis",
                description: "Understand user sentiment and identify trends with comprehensive review data."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-dark-surface backdrop-blur-sm rounded-xl p-6 shadow-dark border border-dark-border hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Form Section */}
          <div className="max-w-4xl mx-auto">
            <ReviewForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">Have questions or feedback? Reach out to me.</p>
              <p className="text-gray-400 mt-2 cursor-pointer">grruthvik@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}