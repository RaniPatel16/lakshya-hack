import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Compass, User, MessageSquare, LogOut, ArrowRightLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AIAssistant from '../components/AIAssistant';

export default function RootLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-background text-charcoal font-sans selection:bg-highlight selection:text-white">
      {/* Floating Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 w-full matte-glass border-b border-surface/50 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 font-medium tracking-tight text-lg group">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background shadow-soft group-hover:scale-105 transition-transform">
            <Sparkles size={16} />
          </div>
          SkillSphere
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-charcoal/70">
          <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <User size={16} /> Dashboard
          </Link>
          <Link to="/explore" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Compass size={16} /> Explore
          </Link>
          <Link to="/swaps" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowRightLeft size={16} /> Swaps
          </Link>
          <Link to="/roadmap" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Compass size={16} /> Roadmap
          </Link>
          <Link to="/matches" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Sparkles size={16} /> Matches
          </Link>
          <Link to="/messages" className="hover:text-primary transition-colors flex items-center gap-1.5 relative">
            <MessageSquare size={16} /> Messages
            <span className="absolute -top-1 -right-2 w-2 h-2 bg-highlight rounded-full"></span>
          </Link>
          <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5 text-primary/80">
            <Shield size={16} /> Admin
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-sm font-medium text-charcoal/70 hidden sm:flex items-center gap-2 hover:text-primary transition-colors">
                <div className="w-8 h-8 rounded-full bg-surface-hover overflow-hidden border border-surface">
                  <img src="https://i.pravatar.cc/150?img=11" alt="avatar" />
                </div>
                {user.name}
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors px-3 py-2">
                Log in
              </Link>
              <Link to="/signup" className="text-sm font-medium bg-charcoal text-background px-4 py-2 rounded-full hover:bg-primary transition-colors shadow-soft">
                Sign up
              </Link>
            </>
          )}
        </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Global AI Assistant */}
      <AIAssistant />
    </div>
  );
}
