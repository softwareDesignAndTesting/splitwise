import { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import getUserId from '../utils/getUserId';
import { PageLoader } from '../components/LoadingSpinner';

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    monthlyExpenses: [],
    categoryBreakdown: [],
    topExpenses: [],
    totalSpent: 0,
    activeGroups: 0,
    avgPerMonth: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const userId = getUserId();
        const token = localStorage.getItem('token');
        
        // Fetch user groups
        const groupsRes = await axios.get(`/group-memberships/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const groups = Array.isArray(groupsRes.data) ? groupsRes.data : [groupsRes.data];
        
        let allExpenses = [];
        
        for (const group of groups) {
          try {
            // Fetch expenses
            const expensesRes = await axios.get(`/expenses/group/${group._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            allExpenses = [...allExpenses, ...expensesRes.data];
          } catch (err) {
            console.log('Error fetching data for group:', group._id);
          }
        }

        // Process data
        const monthlyData = processMonthlyData(allExpenses);
        const categoryData = processCategoryData(allExpenses);
        const topExpensesData = allExpenses.sort((a, b) => b.amount - a.amount).slice(0, 5);
        const totalSpent = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const thisMonthExpenses = allExpenses.filter(exp => {
          const expDate = new Date(exp.createdAt);
          const now = new Date();
          return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
        });
        const thisMonth = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        setAnalytics({
          monthlyExpenses: monthlyData,
          categoryBreakdown: categoryData,
          topExpenses: topExpensesData,
          totalSpent,
          activeGroups: groups.length,
          avgPerMonth: monthlyData.length > 0 ? totalSpent / monthlyData.length : 0,
          thisMonth
        });
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const processMonthlyData = (expenses) => {
    const monthlyMap = {};
    expenses.forEach(expense => {
      const month = new Date(expense.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyMap[month] = (monthlyMap[month] || 0) + expense.amount;
    });
    return Object.entries(monthlyMap).map(([month, amount]) => ({ month, amount }));
  };

  const processCategoryData = (expenses) => {
    const categoryMap = {};
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      categoryMap[category] = (categoryMap[category] || 0) + expense.amount;
    });
    return Object.entries(categoryMap).map(([category, amount], index) => ({ 
      category, 
      amount, 
      color: colors[index % colors.length] 
    }));
  };

  if (loading) {
    return <PageLoader text="Loading analytics..." />;
  }

  const statCards = [
    {
      title: 'Total spent',
      value: `₹${analytics.totalSpent.toLocaleString()}`,
      helper: 'All time across groups',
      gradient: 'from-emerald-500 to-emerald-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z" />
        </svg>
      ),
    },
    {
      title: 'Active groups',
      value: analytics.activeGroups,
      helper: 'Groups you are part of',
      gradient: 'from-sky-500 to-blue-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Monthly average',
      value: `₹${Math.round(analytics.avgPerMonth).toLocaleString()}`,
      helper: 'Your spending pattern',
      gradient: 'from-purple-500 to-indigo-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'This month',
      value: `₹${analytics.thisMonth.toLocaleString()}`,
      helper: new Date().toLocaleDateString('en-US', { month: 'long' }),
      gradient: 'from-amber-500 to-orange-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-12 space-y-10">
        <div className="glass-panel rounded-3xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className="pill-badge bg-emerald-100 text-emerald-700 inline-block mb-3">
                Analytics overview
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Your spending insights
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Track patterns, categories, and trends across all your groups and expenses.
              </p>
            </div>
            <div className="text-sm text-slate-500 bg-slate-100 rounded-full px-4 py-2 w-fit">
              Live data ✅
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-2xl p-5 text-white bg-gradient-to-br ${card.gradient} floating-card`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    {card.icon}
                  </div>
                </div>
                <p className="text-sm uppercase tracking-wide text-white/70">{card.title}</p>
                <p className="text-3xl font-bold mt-1">{card.value}</p>
                <p className="text-sm text-white/70 mt-2">{card.helper}</p>
              </div>
            ))}
          </div>

          {/* Monthly Expenses Chart */}
          <div className="glass-panel rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
              <svg className="w-5 h-5 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Monthly spending trend
            </h2>
            <div className="space-y-4">
              {analytics.monthlyExpenses.length > 0 ? analytics.monthlyExpenses.map((item, index) => {
                const maxAmount = Math.max(...analytics.monthlyExpenses.map(i => i.amount));
                const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                return (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-700">{item.month}</span>
                      <span className="text-lg font-bold text-emerald-600">₹{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No monthly data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Category Breakdown */}
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                <svg className="w-5 h-5 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                </svg>
                Category breakdown
              </h2>
              <div className="space-y-4">
                {analytics.categoryBreakdown.length > 0 ? analytics.categoryBreakdown.map((item, index) => {
                  const totalAmount = analytics.categoryBreakdown.reduce((sum, cat) => sum + cat.amount, 0);
                  const percentage = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                        <div>
                          <span className="font-medium text-slate-900">{item.category}</span>
                          <p className="text-sm text-slate-500">{percentage}% of total</p>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-900">₹{item.amount.toLocaleString()}</span>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No category data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Expenses */}
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                <svg className="w-5 h-5 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Top expenses
              </h2>
              <div className="space-y-4">
                {analytics.topExpenses.length > 0 ? analytics.topExpenses.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-emerald-600 font-semibold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{expense.description}</div>
                        <div className="text-sm text-slate-500">{new Date(expense.createdAt).toLocaleDateString()} • {expense.category || 'General'}</div>
                      </div>
                    </div>
                    <span className="font-semibold text-slate-900">₹{expense.amount.toLocaleString()}</span>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No expenses found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}