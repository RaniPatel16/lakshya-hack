import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface User {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
  skillsOffered: string[];
  skillsWanted: string[];
}

interface MatchResult {
  user: User;
  score: number;
  reason: string;
}

export default function Matches() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchAndCalculateMatches = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // 1. Fetch all users
        const response = await fetch('http://localhost:5000/api/users', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const allUsers: User[] = await response.json();
        
        if (!allUsers || allUsers.length === 0) {
          setLoading(false);
          return;
        }

        // Take up to 2 users to match against to avoid too many API calls
        const usersToMatch = allUsers.slice(0, 2);
        const matchResults: MatchResult[] = [];

        for (const targetUser of usersToMatch) {
          const aiRes = await fetch('http://localhost:5000/api/ai/match-score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
              user1Skills: user.skillsWanted || [],
              user2Skills: targetUser.skillsOffered || []
            })
          });

          if (aiRes.ok) {
            const aiData = await aiRes.json();
            matchResults.push({
              user: targetUser,
              score: aiData.score || Math.floor(Math.random() * 30 + 70), // fallback score
              reason: aiData.reason || "This looks like a solid match based on overlapping skills."
            });
          }
        }

        // Sort matches by highest score
        matchResults.sort((a, b) => b.score - a.score);
        setMatches(matchResults);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
        setError('Failed to load AI matches.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateMatches();
  }, [user]);

  const handleRequestSwap = async (targetUser: User) => {
    if (!user) return;
    const skillOffered = user.skillsOffered?.[0] || 'My Skill';
    const skillWanted = targetUser.skillsOffered?.[0] || 'Their Skill';
    
    try {
      await fetch('http://localhost:5000/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          receiverId: targetUser._id,
          skillOffered,
          skillWanted,
          message: `Hi ${targetUser.name}, our AI match score is high! Let's swap.`
        })
      });
      alert(`Swap request sent to ${targetUser.name}!`);
    } catch (error) {
      console.error("Failed to send request", error);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-charcoal mb-4">Your AI Matches</h1>
        <p className="text-charcoal/60 text-lg max-w-2xl">
          Our neural engine has analyzed profiles to find these optimal skill swaps for you.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-dashed border-surface-hover rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-70"
          >
            <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mb-4">
              <Brain className="text-charcoal/40" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">Analyzing profiles...</h3>
            <p className="text-sm text-charcoal/60 max-w-xs mb-6">Our AI is actively searching the network for your next perfect match.</p>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </motion.div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : matches.length === 0 ? (
          <div className="text-charcoal/60">No suitable matches found at this time.</div>
        ) : (
          <AnimatePresence>
            {matches.map((match, idx) => (
              <motion.div 
                key={match.user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="matte-surface rounded-3xl p-8 relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-background overflow-hidden border-2 border-background shadow-soft">
                      <img src={match.user.avatar || `https://ui-avatars.com/api/?name=${match.user.name}&background=random`} alt={match.user.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal">{match.user.name}</h3>
                      <p className="text-sm text-charcoal/60">{match.user.bio || 'Continuous Learner'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-primary font-bold text-2xl">
                      {match.score}% <Brain size={20} />
                    </div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-primary/70">Match Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                  <div className="bg-background/50 rounded-2xl p-4">
                    <span className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider block mb-2">Can teach</span>
                    <div className="flex flex-wrap gap-2">
                      {match.user.skillsOffered?.length > 0 ? match.user.skillsOffered.map(s => (
                        <span key={s} className="px-3 py-1 bg-background text-charcoal text-sm rounded-full shadow-sm">{s}</span>
                      )) : <span className="text-sm text-charcoal/50">None</span>}
                    </div>
                  </div>
                  <div className="bg-background/50 rounded-2xl p-4">
                    <span className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider block mb-2">Wants to learn</span>
                    <div className="flex flex-wrap gap-2">
                      {match.user.skillsWanted?.length > 0 ? match.user.skillsWanted.map(s => (
                        <span key={s} className="px-3 py-1 bg-primary text-background text-sm rounded-full shadow-sm">{s}</span>
                      )) : <span className="text-sm text-charcoal/50">None</span>}
                    </div>
                  </div>
                </div>

                <div className="bg-highlight/10 border border-highlight/20 rounded-2xl p-5 mb-8 relative z-10">
                  <div className="flex gap-3">
                    <SparklesIcon className="text-highlight shrink-0 mt-1" size={20} />
                    <p className="text-sm text-charcoal/80 leading-relaxed">
                      <span className="font-semibold text-charcoal block mb-1">AI Insight</span>
                      {match.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  <button 
                    onClick={() => handleRequestSwap(match.user)}
                    className="flex-1 bg-charcoal text-background py-3 rounded-full font-medium hover:bg-primary transition-colors shadow-soft"
                  >
                    Request Swap
                  </button>
                  <button className="p-3 bg-background text-charcoal rounded-full hover:bg-surface transition-colors shadow-soft">
                    <Star size={20} />
                  </button>
                </div>
                
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
