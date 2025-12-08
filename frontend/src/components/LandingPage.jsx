import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className={`glass-panel rounded-3xl p-12 mb-12 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-4xl animate-bounce">💸</span>
            </div>
            <div className="pill-badge bg-gradient-to-r from-emerald-500 to-teal-600 text-white inline-block mb-6 px-6 py-2 text-sm font-medium tracking-wide">
              FRIEND GROUPS • TRAVEL • ROOMMATES
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Split every rupee with zero awkwardness
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Beautiful dashboards, lightning-fast inputs, and real-world workflows tuned for your college group, flatmates, or travel squad.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/signup"
                className="group bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-emerald-200"
              >
                <span className="flex items-center justify-center gap-2">
                  Create free account
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              <Link 
                to="/login"
                className="bg-white/70 hover:bg-white border-2 border-slate-300 hover:border-emerald-400 text-slate-900 font-bold px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Already using Splitwise?
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="glass-panel rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="pill-badge bg-gradient-to-r from-emerald-500 to-teal-600 text-white inline-block mb-4 px-4 py-2">
              Live snapshot
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">₹18,540</div>
            <p className="text-white/90 font-medium">settled inside demo group over last 15 days</p>
          </div>
          
          <div className="glass-panel rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="pill-badge bg-gradient-to-r from-slate-600 to-slate-700 text-white inline-block mb-4 px-4 py-2">
              Trusted circle
            </div>
            <div className="text-4xl font-bold text-white mb-3">25 real people • 4 active groups</div>
            <p className="text-white/90 font-medium">Use their logins to show professors how the product feels in production.</p>
          </div>
        </div>

        {/* Experience Section */}
        <div className={`glass-panel rounded-3xl p-8 mb-12 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="pill-badge bg-gradient-to-r from-purple-500 to-pink-600 text-white inline-block mb-6 px-4 py-2">
            Experience
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 text-white font-semibold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Responsive cards & glassmorphism shell
            </div>
            <div className="flex items-center gap-3 text-white font-semibold">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Sub-second navigation
            </div>
            <div className="flex items-center gap-3 text-white font-semibold">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Color-coded insights per group
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className={`glass-panel rounded-3xl p-12 mb-12 transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose Splitwise?</h2>
            <p className="text-2xl text-white/90 font-semibold">Simple, fair, and transparent expense sharing</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-panel rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">⚖️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Fair Splitting</h3>
              <p className="text-white/90 font-medium leading-relaxed">Split expenses equally or by custom amounts. Everyone pays their fair share.</p>
            </div>
            
            <div className="glass-panel rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="text-2xl font-bold text-white mb-4">Track Everything</h3>
              <p className="text-white/90 font-medium leading-relaxed">Keep track of all expenses and see who owes what at a glance.</p>
            </div>
            
            <div className="glass-panel rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">💳</div>
              <h3 className="text-2xl font-bold text-white mb-4">Easy Settlement</h3>
              <p className="text-white/90 font-medium leading-relaxed">Settle up with friends quickly and keep your relationships money-stress free.</p>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="glass-panel rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🏠</div>
            <h3 className="text-2xl font-bold text-white mb-4">Roommates</h3>
            <p className="text-white/90 font-medium leading-relaxed">Track rent, Wi-Fi, groceries, and random Swiggy runs without opening a spreadsheet.</p>
          </div>
          
          <div className="glass-panel rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">📚</div>
            <h3 className="text-2xl font-bold text-white mb-4">College projects</h3>
            <p className="text-white/90 font-medium leading-relaxed">Centralize printing, Uber, and prototype purchases while keeping every teammate in the loop.</p>
          </div>
          
          <div className="glass-panel rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">✈️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Trips & clubs</h3>
            <p className="text-white/90 font-medium leading-relaxed">From garba nights to hackathons, create a group in seconds and share a simple invite link.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`glass-panel rounded-3xl p-12 text-center transform transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to start splitting smarter?</h2>
          <p className="text-2xl text-white/90 mb-12 font-semibold">Join thousands of users who trust Splitwise for their expense sharing needs.</p>
          <Link 
            to="/signup"
            className="group bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-12 py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-emerald-200 inline-block"
          >
            <span className="flex items-center justify-center gap-3">
              Create Free Account
              <span className="group-hover:translate-x-2 transition-transform text-xl">🚀</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}