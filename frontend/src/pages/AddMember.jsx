import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import getUserId from '../utils/getUserId';

export default function AddMember() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [adding, setAdding] = useState(false);
  const [userDegrees, setUserDegrees] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/users/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(res.data);
    };
    fetchUsers();
  }, []);

  const fetchMembers = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`/group-memberships/group/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMembers(res.data);
  };
  useEffect(() => { fetchMembers(); }, [groupId]);

  useEffect(() => {
    if (search.length > 0) {
      const memberIds = new Set(members.map(m => m.userId._id));
      setFilteredUsers(
        allUsers.filter(u =>
          (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
          !memberIds.has(u._id)
        )
      );
    } else {
      setFilteredUsers([]);
    }
  }, [search, allUsers, members]);

  const handleAdd = async (userId) => {
    setAdding(true);
    const token = localStorage.getItem('token');
    await axios.post('/group-memberships', { userId, groupId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAdding(false);
    setSearch('');
    setFilteredUsers([]);
    fetchMembers();
  };

  useEffect(() => {
    const myUserId = getUserId();
    const token = localStorage.getItem('token');
    const fetchDegrees = async () => {
      const newDegrees = {};
      await Promise.all(filteredUsers.map(async (user) => {
        try {
          const res = await axios.get(`/users/degree/${myUserId}/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          newDegrees[user._id] = res.data.degree;
        } catch {
          newDegrees[user._id] = '-';
        }
      }));
      setUserDegrees(newDegrees);
    };
    if (filteredUsers.length > 0) fetchDegrees();
  }, [filteredUsers]);

  const getDegreeLabel = (degree) => {
    if (degree === 1) return '1st';
    if (degree === 2) return '2nd';
    if (degree === 3) return '3rd';
    if (degree >= 4) return '3+';
    return '3+';
  };

  return (
    <div className="min-h-screen bg-app text-slate-100 pb-20">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/groups/${groupId}`)} 
            className="btn-ghost flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Add Member</h1>
        </div>

        {/* Search Section */}
        <div className="glass-panel rounded-2xl p-6 glow-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Search Users</h2>
            <span className="text-sm text-slate-600">Type name or email to invite</span>
          </div>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search by name or email..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          
          {/* Search Results */}
          {filteredUsers.length > 0 && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredUsers.map(user => (
                <div 
                  key={user._id} 
                  onClick={() => handleAdd(user._id)} 
                  className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-white/10 text-emerald-100 px-2 py-1 rounded-full font-medium border border-emerald-300/40">
                      {getDegreeLabel(userDegrees[user._id])} connection
                    </span>
                    <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {adding && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center text-emerald-200">
                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding member...
              </div>
            </div>
          )}
        </div>

        {/* Current Members */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Current Members ({members.length})</h2>
          <div className="space-y-3">
            {members.map(m => (
              <div key={m.userId._id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{m.userId.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{m.userId.name}</p>
                    <p className="text-sm text-slate-600">{m.userId.email}</p>
                  </div>
                </div>
                <span className="text-xs bg-white/10 text-blue-100 px-2 py-1 rounded-full font-medium border border-blue-300/30">
                  Member
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}