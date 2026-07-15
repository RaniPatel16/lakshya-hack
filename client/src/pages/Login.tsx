import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Globe, Mail, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full absolute top-0 left-0 bg-background z-50">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-12 lg:px-24 justify-center relative overflow-y-auto">
        <Link to="/" className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors">
          <ArrowLeft size={20} /> Back
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md w-full mx-auto"
        >
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-background mb-8 shadow-soft">
            <Sparkles size={24} />
          </div>
          <h2 className="text-4xl font-semibold text-charcoal mb-3 tracking-tight">Welcome back</h2>
          <p className="text-charcoal/60 text-lg mb-8">Sign in to your SkillSphere account.</p>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex justify-center items-center gap-2 border border-surface rounded-xl py-3 hover:bg-surface/50 transition-colors text-sm font-medium text-charcoal">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="flex justify-center items-center gap-2 border border-surface rounded-xl py-3 hover:bg-surface/50 transition-colors text-sm font-medium text-charcoal">
              <Globe className="w-5 h-5" />
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-surface flex-1"></div>
            <span className="text-xs text-charcoal/40 font-medium uppercase tracking-wider">or sign in with email</span>
            <div className="h-px bg-surface flex-1"></div>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <input 
                type="email" 
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full bg-transparent border-2 border-surface rounded-xl px-4 pt-6 pb-2 text-charcoal outline-none focus:border-primary transition-colors placeholder-transparent"
                placeholder="you@example.com"
              />
              <label htmlFor="email" className="absolute left-4 top-2 text-xs font-semibold text-charcoal/50 uppercase tracking-wide transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:uppercase peer-focus:text-primary pointer-events-none">
                Email Address
              </label>
              <Mail className="absolute right-4 top-4 text-charcoal/30 peer-focus:text-primary transition-colors" size={20} />
            </div>
            
            <div className="relative group">
              <input 
                type="password" 
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full bg-transparent border-2 border-surface rounded-xl px-4 pt-6 pb-2 text-charcoal outline-none focus:border-primary transition-colors placeholder-transparent"
                placeholder="••••••••"
              />
              <label htmlFor="password" className="absolute left-4 top-2 text-xs font-semibold text-charcoal/50 uppercase tracking-wide transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:uppercase peer-focus:text-primary pointer-events-none">
                Password
              </label>
            </div>

            <div className="flex justify-between items-center px-1">
              <label className="flex items-center gap-2 text-sm text-charcoal/70 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-surface text-primary focus:ring-primary/20" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-charcoal text-background font-medium py-4 rounded-xl hover:bg-primary transition-all shadow-soft mt-8 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? <div className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin"></div> : 'Sign in'}
            </button>
          </form>
          
          <p className="text-center text-charcoal/60 text-sm mt-8">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>

      {/* Abstract Graphic Section */}
      <div className="hidden lg:flex w-1/2 bg-charcoal relative overflow-hidden items-center justify-center p-12">
        <div className="relative z-10 max-w-lg text-background">
          <h2 className="text-5xl font-semibold mb-6 leading-tight">Master new skills <br/><span className="text-highlight italic font-serif">collaboratively.</span></h2>
          <p className="text-background/70 text-lg">Join thousands of professionals actively trading knowledge on the most advanced AI-powered platform.</p>
        </div>

        {/* Animated Background Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] border-[1px] border-white/10 rounded-full"
        ></motion.div>
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] border-[1px] border-white/10 rounded-full"
        ></motion.div>
        
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/30 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}
