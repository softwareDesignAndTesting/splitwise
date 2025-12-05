import { useState } from 'react';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ButtonLoader } from '../components/LoadingSpinner';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await axios.post('/users/signup', { name: username, email, password });
      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="glass-panel rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💸</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create account</h1>
            <p className="text-slate-600">Join thousands splitting expenses smartly</p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <div className="relative">
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Full name"
                  className={`w-full px-4 py-4 border-2 rounded-2xl bg-white/50 focus:bg-white focus:outline-none transition-all ${
                    errors.username ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-2 ml-2">{errors.username}</p>}
            </div>

            <div>
              <div className="relative">
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Email address"
                  className={`w-full px-4 py-4 border-2 rounded-2xl bg-white/50 focus:bg-white focus:outline-none transition-all ${
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-2 ml-2">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Create password"
                  className={`w-full px-4 py-4 border-2 rounded-2xl bg-white/50 focus:bg-white focus:outline-none transition-all ${
                    errors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-2 ml-2">{errors.password}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <ButtonLoader />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="glass-panel rounded-xl p-4">
              <div className="text-xl mb-2">⚖️</div>
              <div className="font-medium text-slate-700">Fair Splits</div>
            </div>
            <div className="glass-panel rounded-xl p-4">
              <div className="text-xl mb-2">📊</div>
              <div className="font-medium text-slate-700">Track Everything</div>
            </div>
            <div className="glass-panel rounded-xl p-4">
              <div className="text-xl mb-2">💳</div>
              <div className="font-medium text-slate-700">Easy Settlement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}