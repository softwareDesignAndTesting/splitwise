export default function Footer() {
  return (
    <footer className="w-full bg-slate-900/70 backdrop-blur-2xl border-t border-white/10 text-slate-200 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg glow-border">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
            </svg>
          </div>
          <span className="text-sm font-medium">
            &copy; {new Date().getFullYear()} Splitwise — Crafted with <span className="text-rose-300">❤️</span> by Kalyani Dave
          </span>
        </div>
      </div>
    </footer>
  );
}