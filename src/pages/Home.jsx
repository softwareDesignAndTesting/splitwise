import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8">
              <span className="text-4xl">💸</span>
            </div>
            <p className="pill-badge bg-white/20 text-xs tracking-[0.2em] mx-auto text-white/80 mb-4">
              FRIEND GROUPS • TRAVEL • ROOMMATES
            </p>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4">
              Split every rupee with zero awkwardness
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
              Beautiful dashboards, lightning-fast inputs, and real-world workflows tuned for your college group, flatmates, or travel squad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-emerald-700 font-bold px-10 py-4 rounded-2xl text-lg hover:-translate-y-0.5 hover:shadow-2xl transition-all"
              >
                Create free account
              </Link>
              <Link
                to="/login"
                className="border-2 border-white/70 text-white font-bold px-10 py-4 rounded-2xl text-lg hover:bg-white hover:text-emerald-700 transition-colors"
              >
                Already using Splitwise?
              </Link>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3 text-left">
              <div className="glass-panel rounded-2xl p-5 text-slate-900">
                <p className="pill-badge bg-emerald-100 text-emerald-700 mb-3">Live snapshot</p>
                <p className="text-3xl font-bold text-emerald-600">₹18,540</p>
                <p className="text-sm text-slate-600">settled inside demo group over last 15 days</p>
              </div>
              <div className="glass-panel rounded-2xl p-5">
                <p className="pill-badge bg-blue-100 text-blue-700 mb-3">Trusted circle</p>
                <p className="font-semibold text-lg text-slate-700">25 real people • 4 active groups</p>
                <p className="text-sm text-slate-500 mt-1">Use their logins to show professors how the product feels in production.</p>
              </div>
              <div className="glass-panel rounded-2xl p-5">
                <p className="pill-badge bg-amber-100 text-amber-700 mb-3">Experience</p>
                <ul className="space-y-1 text-slate-700">
                  <li>• Responsive cards & glassmorphism shell</li>
                  <li>• Sub-second navigation</li>
                  <li>• Color-coded insights per group</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Splitwise?
            </h2>
            <p className="text-xl text-gray-600">
              Simple, fair, and transparent expense sharing
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">⚖️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fair Splitting</h3>
              <p className="text-gray-600">
                Split expenses equally or by custom amounts. Everyone pays their fair share.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-teal-50 border border-teal-100">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Track Everything</h3>
              <p className="text-gray-600">
                Keep track of all expenses and see who owes what at a glance.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">💳</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Easy Settlement</h3>
              <p className="text-gray-600">
                Settle up with friends quickly and keep your relationships money-stress free.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Use-case tiles */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Roommates',
              copy: 'Track rent, Wi-Fi, groceries, and random Swiggy runs without opening a spreadsheet.',
              icon: '🏠'
            },
            {
              title: 'College projects',
              copy: 'Centralize printing, Uber, and prototype purchases while keeping every teammate in the loop.',
              icon: '📚'
            },
            {
              title: 'Trips & clubs',
              copy: 'From garba nights to hackathons, create a group in seconds and share a simple invite link.',
              icon: '✈️'
            }
          ].map((item) => (
            <div key={item.title} className="glass-panel rounded-3xl p-8 floating-card">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-semibold mb-3 text-slate-900">{item.title}</h3>
              <p className="text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start splitting smarter?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who trust Splitwise for their expense sharing needs.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
} 