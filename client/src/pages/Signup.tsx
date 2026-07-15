import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Globe, Mail, User, ShieldCheck } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  useEffect(() => {
    let s = 0;
    if (password.length > 5) s += 1;
    if (password.length > 8) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    setStrength(Math.min(4, s));
  }, [password]);

  const strengthColors = ['bg-surface', 'bg-red-400', 'bg-orange-400', 'bg-highlight', 'bg-primary'];
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 2) {
      setError("Please use a stronger password.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full absolute top-0 left-0 bg-background z-50">
      
      {/* Abstract Graphic Section (Left side for Signup) */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="relative z-10 max-w-lg text-background">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-5xl font-semibold mb-6 leading-tight">Your knowledge <br/>is your <span className="text-highlight italic font-serif">currency.</span></h2>
          <p className="text-background/80 text-lg">Build your profile, showcase your skills, and let our neural engine pair you with perfect mentors globally.</p>
        </div>

        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-highlight/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-charcoal/30 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-12 lg:px-24 justify-center relative overflow-y-auto">
        <Link to="/" className="absolute top-8 right-8 md:top-12 md:right-12 flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors">
           Back to home <ArrowLeft size={20} className="rotate-180" />
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md w-full mx-auto"
        >
          <h2 className="text-4xl font-semibold text-charcoal mb-3 tracking-tight">Create account</h2>
          <p className="text-charcoal/60 text-lg mb-8">Join the SkillSphere community today.</p>

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
            <span className="text-xs text-charcoal/40 font-medium uppercase tracking-wider">or sign up with email</span>
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
                type="text" 
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer w-full bg-transparent border-2 border-surface rounded-xl px-4 pt-6 pb-2 text-charcoal outline-none focus:border-primary transition-colors placeholder-transparent"
                placeholder="John Doe"
              />
              <label htmlFor="name" className="absolute left-4 top-2 text-xs font-semibold text-charcoal/50 uppercase tracking-wide transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:uppercase peer-focus:text-primary pointer-events-none">
                Full Name
              </label>
              <User className="absolute right-4 top-4 text-charcoal/30 peer-focus:text-primary transition-colors" size={20} />
            </div>

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

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="px-1">
                <div className="flex gap-1 h-1.5 w-full mb-2">
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength >= level ? strengthColors[strength] : 'bg-surface'}`}></div>
                  ))}
                </div>
                <p className={`text-xs font-medium ${strength > 2 ? 'text-primary' : 'text-charcoal/50'}`}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-charcoal text-background font-medium py-4 rounded-xl hover:bg-primary transition-all shadow-soft mt-8 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? <div className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin"></div> : 'Create account'}
            </button>
          </form>
          
          <p className="text-center text-charcoal/60 text-sm mt-8">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
}
