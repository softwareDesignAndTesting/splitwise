import { useState } from 'react';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ButtonLoader } from '../components/LoadingSpinner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const res = await axios.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-600">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative">
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => {setEmail(e.target.value); setErrors({...errors, email: ''});}} 
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
                  onChange={e => {setPassword(e.target.value); setErrors({...errors, password: ''});}} 
                  placeholder="Password"
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
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              New to Splitwise?{' '}
              <Link 
                to="/signup" 
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="glass-panel rounded-2xl p-6 text-center">
            <p className="pill-badge bg-emerald-100 text-emerald-700 inline-block mb-3">
              Trusted by thousands
            </p>
            <p className="text-slate-600 text-sm">
              Split expenses effortlessly with friends and family. Track, settle, and stay organized.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}