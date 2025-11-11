export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 mt-12 shadow-lg fixed bottom-0 left-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
            </svg>
          </div>
          <span className="text-sm font-medium">
            &copy; {new Date().getFullYear()} Splitwise &mdash; Made with <span className="text-red-300">❤️</span> by Kalyani Dave
          </span>
        </div>
      </div>
    </footer>
  );
} 