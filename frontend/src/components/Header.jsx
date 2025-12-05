import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500 rounded-2xl flex items-center justify-center shadow-xl glow-border">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-white">
            Splitwise
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors font-medium px-3 py-2 rounded-xl hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2H3z" />
            </svg>
            Dashboard
          </Link>
          <Link 
            to="/analytics" 
            className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors font-medium px-3 py-2 rounded-xl hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </Link>
          <Link 
            to="/create-group" 
            className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors font-medium px-3 py-2 rounded-xl hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Group
          </Link>
        </nav>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 hover:bg-white/15 transition-all duration-300 text-white"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="hidden md:block text-sm font-medium">Account</span>
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl py-2 backdrop-blur-xl">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-slate-200 hover:bg-white/10 hover:text-white transition-colors w-full text-left text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 