import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="text-center">
            {/* Icon with Glow Effect */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/30 backdrop-blur-sm rounded-3xl mb-8 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <span className="text-5xl filter drop-shadow-lg">💸</span>
            </div>

            <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tight">
              Splitwise
            </h1>

            <p className="text-2xl md:text-3xl text-white/95 mb-4 max-w-3xl mx-auto font-light">
              Split bills effortlessly
            </p>

            <p className="text-lg text-emerald-50 mb-12 max-w-2xl mx-auto">
              The smartest way to share expenses with friends and family.
              Track spending, settle debts, and keep relationships stress-free.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                to="/signup"
                className="group bg-white text-emerald-600 font-bold px-10 py-5 rounded-full text-lg hover:bg-emerald-50 transition-all duration-300 shadow-2xl hover:shadow-emerald-200 hover:scale-105 transform"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              <Link
                to="/login"
                className="group border-3 border-white/90 bg-white/10 backdrop-blur-sm text-white font-bold px-10 py-5 rounded-full text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Features Section with Modern Cards */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Simple, Fair & Transparent
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage shared expenses with ease
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature Card 1 */}
            <div className="group relative text-center p-10 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-emerald-600/0 group-hover:from-emerald-400/5 group-hover:to-emerald-600/10 rounded-3xl transition-all duration-300"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl text-white">⚖️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Fair Splitting</h3>
                <p className="text-gray-600 leading-relaxed">
                  Split expenses equally or by custom amounts. Everyone pays their fair share, no confusion.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative text-center p-10 rounded-3xl bg-gradient-to-br from-teal-50 to-teal-100/50 border-2 border-teal-200 hover:border-teal-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/0 to-teal-600/0 group-hover:from-teal-400/5 group-hover:to-teal-600/10 rounded-3xl transition-all duration-300"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl text-white">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Everything</h3>
                <p className="text-gray-600 leading-relaxed">
                  Keep track of all expenses and see who owes what at a glance with beautiful analytics.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative text-center p-10 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/5 group-hover:to-blue-600/10 rounded-3xl transition-all duration-300"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl text-white">💳</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Easy Settlement</h3>
                <p className="text-gray-600 leading-relaxed">
                  Settle up with friends quickly and keep your relationships completely money-stress free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="text-5xl font-black text-emerald-600 mb-2">10K+</div>
              <div className="text-lg text-gray-600 font-medium">Active Users</div>
            </div>
            <div className="p-8">
              <div className="text-5xl font-black text-teal-600 mb-2">$2M+</div>
              <div className="text-lg text-gray-600 font-medium">Expenses Tracked</div>
            </div>
            <div className="p-8">
              <div className="text-5xl font-black text-cyan-600 mb-2">50K+</div>
              <div className="text-lg text-gray-600 font-medium">Bills Split</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section with Modern Design */}
      <div className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to start splitting smarter?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust Splitwise for hassle-free expense sharing.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-12 py-5 rounded-full text-lg transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transform"
          >
            Create Free Account
            <span className="text-2xl">🚀</span>
          </Link>
          <p className="mt-6 text-gray-400 text-sm">No credit card required • Free forever</p>
        </div>
      </div>
    </div>
  );
} 