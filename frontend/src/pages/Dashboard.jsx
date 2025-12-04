import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserGroups from '../components/UserGroups';
import axios from '../utils/axiosInstance';
import getUserId from '../utils/getUserId';
import { PageLoader } from '../components/LoadingSpinner';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalExpenses: 0,
    totalAmount: 0,
    pendingSettlements: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userId = getUserId();
        const token = localStorage.getItem('token');
        
        // Fetch user groups
        const groupsRes = await axios.get(`/group-memberships/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const groups = Array.isArray(groupsRes.data) ? groupsRes.data : [groupsRes.data];
        
        // Calculate stats from groups
        let totalExpenses = 0;
        let totalAmount = 0;
        
        for (const group of groups) {
          try {
            const expensesRes = await axios.get(`/expenses/group/${group._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            totalExpenses += expensesRes.data.length;
            totalAmount += expensesRes.data.reduce((sum, exp) => sum + exp.amount, 0);
          } catch (err) {
            console.log('Error fetching expenses for group:', group._id);
          }
        }
        
        setStats({
          totalGroups: groups.length,
          totalExpenses,
          totalAmount,
          pendingSettlements: Math.floor(totalExpenses * 0.3) // Mock calculation
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <PageLoader text="Loading your dashboard..." />;
  }

  const statCards = [
    {
      title: 'Active groups',
      value: stats.totalGroups,
      helper: stats.totalGroups ? 'You are collaborating already' : 'Create your first group',
      gradient: 'from-emerald-500 to-emerald-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Expenses logged',
      value: stats.totalExpenses,
      helper: 'Entries across every group',
      gradient: 'from-sky-500 to-blue-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
    },
    {
      title: 'Total volume',
      value: `₹${stats.totalAmount.toLocaleString()}`,
      helper: 'All-time across friends',
      gradient: 'from-purple-500 to-indigo-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z" />
        </svg>
      ),
    },
    {
      title: 'Pending settle-ups',
      value: stats.pendingSettlements,
      helper: 'Ready for a quick review',
      gradient: 'from-amber-500 to-orange-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      title: 'Create a group',
      helper: 'Trips, hostels, clubs — set one up in seconds.',
      to: '/create-group',
      icon: '➕',
    },
    {
      title: 'View analytics',
      helper: 'See trends, categories, and top spenders.',
      to: '/analytics',
      icon: '📊',
    },
    {
      title: 'Jump to my groups',
      helper: 'Scroll to your latest activity feed below.',
      action: () => {
        document.getElementById('user-groups')?.scrollIntoView({ behavior: 'smooth' });
      },
      icon: '⚡',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-12 space-y-10">
        <div className="glass-panel rounded-3xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="pill-badge bg-emerald-100 text-emerald-700 inline-block mb-3">
                Live overview
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Welcome back — everything is synced
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Keep an eye on how much each crew owes, jump into analytics, or spin up a totally new group.
              </p>
            </div>
            <div className="text-sm text-slate-500 bg-slate-100 rounded-full px-4 py-2 w-fit">
              Updated just now ✅
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
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

          <div className="grid gap-4 md:grid-cols-3 mt-8">
            {quickActions.map((action) => {
              const content = (
                <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 h-full floating-card">
                  <div className="text-2xl mb-3">{action.icon}</div>
                  <h3 className="font-semibold text-slate-900">{action.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{action.helper}</p>
                </div>
              );

              if (action.to) {
                return (
                  <Link key={action.title} to={action.to} className="block">
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={action.action}
                  className="text-left w-full"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>

        <div id="user-groups" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="pill-badge bg-emerald-100 text-emerald-700 inline-block mb-2">Groups</p>
              <h2 className="text-2xl font-bold text-slate-900">Your active circles</h2>
              <p className="text-slate-500 text-sm">
                Hover each card to see member counts, totals, and last touch points.
              </p>
            </div>
            <Link
              to="/create-group"
              className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
            >
              New group →
            </Link>
          </div>
          <UserGroups />
        </div>
      </div>
    </div>
  );
}