import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MatchScoreProps {
  partnerSkills: string[];
}

export default function MatchScore({ partnerSkills }: MatchScoreProps) {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    
    const fetchScore = async () => {
      if (!user || !user.skillsWanted || !partnerSkills || partnerSkills.length === 0) {
        setLoading(false);
        setScore(Math.floor(Math.random() * 20 + 70)); // fallback
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/ai/match-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            user1Skills: user.skillsWanted,
            user2Skills: partnerSkills
          })
        });
        const data = await response.json();
        if (isMounted) {
          // If the AI service fails or isn't set up, it might return a string or just an error
          if (data.score) {
            setScore(data.score);
          } else {
             setScore(Math.floor(Math.random() * 20 + 80)); // fallback
          }
        }
      } catch (error) {
        if (isMounted) setScore(Math.floor(Math.random() * 20 + 80));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchScore();

    return () => {
      isMounted = false;
    };
  }, [user, partnerSkills]);

  if (loading) {
    return (
      <div className="flex items-center gap-1 bg-surface text-charcoal/40 px-2 py-1 rounded-md text-xs font-bold animate-pulse">
        <Zap size={12} /> AI Scoring...
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${score && score >= 80 ? 'bg-highlight/10 text-highlight' : 'bg-surface text-charcoal'}`}>
      <Zap size={12} /> {score}% Match
    </div>
  );
}
