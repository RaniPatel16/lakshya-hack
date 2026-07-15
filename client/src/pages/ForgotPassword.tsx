import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex w-full absolute top-0 left-0 bg-background z-50">
      
      <div className="w-full flex flex-col p-8 md:p-12 justify-center items-center relative overflow-y-auto">
        <Link to="/login" className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors">
          <ArrowLeft size={20} /> Back to Login
        </Link>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full matte-surface p-10 rounded-3xl shadow-premium border border-surface"
        >
          <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
            <KeyRound size={28} />
          </div>
          
          <h2 className="text-3xl font-semibold text-charcoal mb-2 tracking-tight">Reset password</h2>
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-charcoal/60 text-[15px] mb-8 leading-relaxed">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative group">
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="peer w-full bg-background border-2 border-surface rounded-xl px-4 pt-6 pb-2 text-charcoal outline-none focus:border-accent transition-colors placeholder-transparent"
                      placeholder="you@example.com"
                    />
                    <label htmlFor="email" className="absolute left-4 top-2 text-xs font-semibold text-charcoal/50 uppercase tracking-wide transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:uppercase peer-focus:text-accent pointer-events-none">
                      Email Address
                    </label>
                    <Mail className="absolute right-4 top-4 text-charcoal/30 peer-focus:text-accent transition-colors" size={20} />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-accent text-background font-medium py-4 rounded-xl hover:bg-accent/90 transition-all shadow-soft mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {isLoading ? <div className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin"></div> : 'Send reset instructions'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail size={32} />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">Check your inbox</h3>
                <p className="text-charcoal/60 mb-8">
                  We've sent an email to <span className="font-medium text-charcoal">{email}</span> with instructions to reset your password.
                </p>
                <button onClick={() => setIsSubmitted(false)} className="text-sm font-medium text-accent hover:underline">
                  Didn't receive the email? Try again.
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
}
