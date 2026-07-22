import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Target, Compass, Code, Layout, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Roadmap() {
  const [targetRole, setTargetRole] = useState('');
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!targetRole || !user) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          currentSkills: user.skillsOffered || ['HTML', 'CSS', 'Basic JavaScript'],
          targetRole
        })
      });
      
      const data = await response.json();
      setRoadmap(data.roadmap || data); // Depending on how backend returns it
    } catch (error) {
      console.error('Failed to generate roadmap', error);
      setRoadmap("Failed to load roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleSuggestions = [
    { title: "Frontend Engineer", icon: Layout },
    { title: "Backend Engineer", icon: Code },
    { title: "Cybersecurity Analyst", icon: Shield },
  ];

  return (
    <div className="pt-10 px-4 md:px-8 max-w-[1000px] mx-auto pb-24">
      <div className="mb-10">
        <h2 className="text-4xl font-semibold text-charcoal mb-4 tracking-tight flex items-center gap-3">
          <Compass className="text-highlight" size={36} /> Career Roadmap
        </h2>
        <p className="text-charcoal/60 text-lg max-w-2xl">
          Use our AI Assistant to generate a personalized, step-by-step learning path based on your current skills and your ultimate career goal.
        </p>
      </div>

      <div className="bg-background border border-surface shadow-sm rounded-3xl p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Full-Stack Developer, Data Scientist..."
              className="w-full bg-surface/50 border border-surface rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-primary transition-colors text-charcoal"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={!targetRole || loading}
            className="w-full md:w-auto bg-charcoal text-background px-8 py-4 rounded-2xl font-medium hover:bg-primary transition-colors disabled:opacity-50 flex justify-center items-center gap-2 flex-shrink-0"
          >
            {loading ? (
              <><span className="animate-spin text-xl">⏳</span> Generating...</>
            ) : (
              <><Sparkles size={18} /> Generate Path</>
            )}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="text-sm text-charcoal/50 font-medium mr-2 self-center">Popular:</span>
          {roleSuggestions.map(role => (
            <button 
              key={role.title}
              onClick={() => setTargetRole(role.title)}
              className="bg-surface hover:bg-surface-hover text-charcoal/80 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <role.icon size={12} /> {role.title}
            </button>
          ))}
        </div>
      </div>

      {roadmap && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-highlight/5 border border-highlight/20 rounded-3xl p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-highlight text-background p-2 rounded-xl">
              <Sparkles size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-charcoal">Your AI Roadmap</h3>
          </div>
          
          <div className="prose prose-charcoal max-w-none">
            {/* Simple markdown parsing for the generated text */}
            {typeof roadmap === 'string' && roadmap.split('\n').map((line, i) => {
              if (line.startsWith('##')) return <h3 key={i} className="text-xl font-bold mt-6 mb-2 text-charcoal">{line.replace('##', '')}</h3>;
              if (line.startsWith('#')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-charcoal">{line.replace('#', '')}</h2>;
              if (line.startsWith('*') || line.startsWith('-')) return <li key={i} className="ml-4 mb-1 text-charcoal/80">{line.replace(/^[-*]\s*/, '')}</li>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} className="mb-2 text-charcoal/80 leading-relaxed">{line}</p>;
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
