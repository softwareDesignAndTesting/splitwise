import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';

export default function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpense(res.data);
      } catch (err) {
        console.error('Error fetching expense', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center text-slate-100">
        <div className="glass-panel rounded-2xl px-8 py-6 text-center">
          <svg className="animate-spin h-10 w-10 text-emerald-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-300">Loading expense details...</p>
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center text-slate-100">
        <div className="glass-panel rounded-2xl px-8 py-6 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Expense Not Found</h2>
          <p className="text-slate-300 mb-6">The expense you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate(-1)}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app pb-20 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="btn-ghost flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Expense Details</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expense Info */}
            <div className="glass-panel rounded-2xl p-8 glow-border">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{expense.description}</h2>
                  <div className="flex items-center space-x-4 text-slate-300">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2m-8 0V7" />
                      </svg>
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center capitalize">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {expense.splitType}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-200">₹{expense.amount.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">Total Amount</div>
                </div>
              </div>
            </div>

            {/* Who Paid */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-cyan-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-white">Who Paid</h3>
              </div>
              <div className="space-y-3">
                {expense.paidBy.map((p) => (
                  <div key={p.userId._id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {p.userId.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{p.userId.name}</div>
                        <div className="text-sm text-slate-300">{p.userId.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyan-200">₹{p.amount.toFixed(2)}</div>
                      <div className="text-xs text-slate-400">Paid</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Among */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-emerald-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-white">Split Among</h3>
              </div>
              <div className="space-y-3">
                {expense.splitMember.map((s) => (
                  <div key={s.userId._id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {s.userId.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{s.userId.name}</div>
                        <div className="text-sm text-slate-300">{s.userId.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-200">₹{s.amount.toFixed(2)}</div>
                      <div className="text-xs text-slate-400">Owes</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">Total Amount</span>
                  <span className="font-semibold text-white">₹{expense.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">Split Type</span>
                  <span className="font-semibold text-white capitalize">{expense.splitType}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">People Involved</span>
                  <span className="font-semibold text-white">{expense.splitMember.length}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-300">Date Created</span>
                  <span className="font-semibold text-white">{new Date(expense.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <button 
                  onClick={() => navigate(-1)}
                  className="w-full btn-ghost text-center"
                >
                  Back to Group
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}