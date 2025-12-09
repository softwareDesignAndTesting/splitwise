import { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import getUserId from '../utils/getUserId';

export default function CreateGroup() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupType, setGroupType] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📂');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const groupTypes = [
    { value: 'friends', label: 'Friends', icon: '👫' },
    { value: 'family', label: 'Family', icon: '🏠' },
    { value: 'trip', label: 'Trip/Travel', icon: '✈️' },
    { value: 'project', label: 'Project', icon: '📚' },
    { value: 'roommates', label: 'Roommates', icon: '🏡' },
    { value: 'other', label: 'Other', icon: '📂' }
  ];

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = getUserId();
      const token = localStorage.getItem('token');
      
      console.log('Creating group with data:', { name, description, userId, type: groupType });
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const res = await axios.post('/groups/', {
        name,
        description,
        userId,
        type: groupType
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Group created:', res.data);
      const newGroupId = res.data._id;
      
      // Add creator as a group member
      await axios.post('/group-memberships', {
        userId,
        groupId: newGroupId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Member added successfully');
      navigate(`/groups/${newGroupId}`);
    } catch (err) {
      console.error('Error creating group:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create group';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = (type) => {
    setGroupType(type.value);
    setSelectedIcon(type.icon);
  };

  return (
    <div className="min-h-screen bg-app text-slate-100 pb-20">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-12 space-y-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-ghost flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Create New Group</h1>
        </div>

        <div className="glass-panel rounded-3xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className="pill-badge bg-emerald-100 text-emerald-700 inline-block mb-3">
                New Group
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Start splitting expenses
              </h2>
              <p className="text-lg text-slate-200 max-w-2xl">
                Create a group to track shared expenses with friends, family, or roommates.
              </p>
            </div>
            <div className="text-6xl">{selectedIcon}</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Group Name *</label>
              <input
                type="text"
                placeholder="e.g., Weekend Trip, Roommate Expenses"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            {/* Group Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-3">Group Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {groupTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`p-4 rounded-xl border transition-all floating-card ${
                      groupType === type.value
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                        : 'border-white/10 bg-white/5 text-slate-100 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Description (Optional)</label>
              <textarea
                placeholder="Add a description for your group..."
                rows="3"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={!name || !groupType || loading}
              className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Group...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Group</span>
                </>
              )}
            </button>
          </form>

          {/* Tips */}
          <div className="mt-8 glass-panel rounded-xl p-4 border border-emerald-400/20">
            <h3 className="text-emerald-200 font-semibold mb-2 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Pro Tips</span>
            </h3>
            <ul className="text-slate-200 text-sm space-y-1">
              <li>• Choose a clear, descriptive name for your group</li>
              <li>• Select the right type to get relevant features</li>
              <li>• You can add members and start tracking expenses right after creation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}