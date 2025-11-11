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
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-xl text-green-100">Track your spending patterns and insights</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Spent</p>
                <p className="text-3xl font-bold">₹{analytics.totalSpent.toLocaleString()}</p>
                <p className="text-green-200 text-xs mt-1">All time</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Groups</p>
                <p className="text-3xl font-bold">{analytics.activeGroups}</p>
                <p className="text-blue-200 text-xs mt-1">Groups joined</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg per Month</p>
                <p className="text-3xl font-bold">₹{Math.round(analytics.avgPerMonth).toLocaleString()}</p>
                <p className="text-purple-200 text-xs mt-1">Monthly average</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold">₹{analytics.thisMonth.toLocaleString()}</p>
                <p className="text-orange-200 text-xs mt-1">{new Date().toLocaleDateString('en-US', { month: 'long' })}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Expenses Chart */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Monthly Spending Trend
          </h2>
          <div className="space-y-4">
            {analytics.monthlyExpenses.length > 0 ? analytics.monthlyExpenses.map((item, index) => {
              const maxAmount = Math.max(...analytics.monthlyExpenses.map(i => i.amount));
              const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
              return (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">{item.month}</span>
                    <span className="text-lg font-bold text-green-600">₹{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-500">
                <p>No monthly data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
              Category Breakdown
            </h2>
            <div className="space-y-4">
              {analytics.categoryBreakdown.length > 0 ? analytics.categoryBreakdown.map((item, index) => {
                const totalAmount = analytics.categoryBreakdown.reduce((sum, cat) => sum + cat.amount, 0);
                const percentage = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0;
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
                      <div>
                        <span className="font-medium text-gray-900">{item.category}</span>
                        <p className="text-sm text-gray-500">{percentage}% of total</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">₹{item.amount.toLocaleString()}</span>
                  </div>
                );
              }) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No category data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Expenses */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Top Expenses
            </h2>
            <div className="space-y-4">
              {analytics.topExpenses.length > 0 ? analytics.topExpenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-green-600 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{expense.description}</div>
                      <div className="text-sm text-gray-500">{new Date(expense.createdAt).toLocaleDateString()} • {expense.category || 'General'}</div>
                    </div>
                  </div>
                  <span className="font-bold text-green-600 text-lg">₹{expense.amount.toLocaleString()}</span>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No expenses found</p>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}