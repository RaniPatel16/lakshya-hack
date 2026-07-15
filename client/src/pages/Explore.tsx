import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Zap, ChevronDown, Flame, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Mentor {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
  skillsOffered: string[];
  skillsWanted: string[];
  level: number;
}

export default function Explore() {
  const [search, setSearch] = useState("");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        setMentors(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const handleRequestSwap = async (mentor: Mentor) => {
    if (!user) return;
    const skillOffered = user.skillsOffered?.[0] || 'My Skill';
    const skillWanted = mentor.skillsOffered?.[0] || 'Their Skill';
    
    try {
      const response = await fetch('http://localhost:5000/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          receiverId: mentor._id,
          skillOffered,
          skillWanted,
          message: `Hi ${mentor.name}, I'd love to swap skills with you!`
        })
      });
      if (response.ok) {
        setSentRequests(prev => ({ ...prev, [mentor._id]: true }));
      }
    } catch (error) {
      console.error("Failed to send request", error);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-10 px-4 md:px-8 max-w-[1400px] mx-auto gap-8 pb-24">
      
      {/* Sidebar Filters */}
      <aside className="w-full md:w-72 flex-shrink-0 space-y-6">
        <div className="sticky top-24">
          <h2 className="text-2xl font-semibold text-charcoal mb-6">Explore</h2>
          
          {/* Search */}
          <div className="relative mb-8">
            <input 
              type="text" 
              placeholder="Search skills, people..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-surface rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-colors text-charcoal shadow-sm"
            />
            <Search className="absolute left-3 top-3.5 text-charcoal/40" size={18} />
          </div>

          {/* Filters */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider mb-3">Availability</h3>
              <div className="space-y-2">
                {['Anytime', 'Weekends', 'Weekdays', 'Evenings (PT)'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer">
                    <input type="checkbox" className="rounded border-surface text-primary focus:ring-primary/20" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider mb-3">Location</h3>
              <div className="space-y-2">
                {['Remote / Anywhere', 'North America', 'Europe', 'Asia Pacific'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer">
                    <input type="checkbox" className="rounded border-surface text-primary focus:ring-primary/20" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider mb-3">Rating</h3>
              <div className="flex gap-2">
                {[4, 4.5, 4.8].map(rt => (
                  <button key={rt} className="flex-1 bg-surface-hover hover:bg-surface text-charcoal text-sm font-medium py-2 rounded-lg transition-colors flex justify-center items-center gap-1">
                    {rt}+ <Star size={12} fill="currentColor" className="text-highlight" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Trending Marquee/Section */}
        <div className="mb-10 p-6 matte-surface rounded-[2rem] border border-highlight/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-charcoal mb-4">
              <Flame className="text-highlight" /> Trending Skills this week
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Generative AI', 'React Server Components', 'Figma Variables', 'System Design', 'Rust'].map((skill, i) => (
                <button key={i} className="bg-background px-4 py-2 rounded-full text-sm font-medium text-charcoal hover:bg-primary hover:text-background transition-colors shadow-sm border border-surface">
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Header Options */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-charcoal/60 font-medium">Showing {mentors.length} potential matches</p>
          <button className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-primary transition-colors">
            Sort by: AI Match <ChevronDown size={16} />
          </button>
        </div>

        {/* Masonry Grid of User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
          {loading ? (
            <div className="col-span-full py-20 text-center text-charcoal/60">Loading users...</div>
          ) : (
            mentors.map((mentor, i) => (
            <motion.div 
              key={mentor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-background rounded-[2rem] p-6 shadow-sm border border-surface hover:shadow-premium hover:border-primary/20 transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <img src={mentor.avatar || `https://ui-avatars.com/api/?name=${mentor.name}&background=random`} alt={mentor.name} className="w-12 h-12 rounded-full border-2 border-surface object-cover" />
                  <div>
                    <h3 className="font-semibold text-charcoal text-lg">{mentor.name}</h3>
                    <p className="text-xs text-charcoal/50">{mentor.bio || "Enthusiastic Learner"}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 bg-highlight/10 text-highlight px-2 py-1 rounded-md text-xs font-bold">
                    <Zap size={12} /> {Math.floor(Math.random() * 20 + 80)}% Match
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-charcoal/60">
                    <Star size={10} className="text-highlight" fill="currentColor" /> {(Math.random() * 1 + 4).toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-charcoal/60 flex items-center gap-1 mb-5">
                <MapPin size={12} /> Remote / Anywhere
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 block mb-2">Can Teach</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.skillsOffered?.length > 0 ? mentor.skillsOffered.map(skill => (
                      <span key={skill} className="bg-surface text-charcoal px-2.5 py-1 rounded text-xs font-medium">{skill}</span>
                    )) : <span className="text-xs text-charcoal/40 italic">No skills listed</span>}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 block mb-2">Wants to Learn</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.skillsWanted?.length > 0 ? mentor.skillsWanted.map(skill => (
                      <span key={skill} className="bg-primary/5 text-primary px-2.5 py-1 rounded text-xs font-medium">{skill}</span>
                    )) : <span className="text-xs text-charcoal/40 italic">No skills listed</span>}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleRequestSwap(mentor)}
                disabled={sentRequests[mentor._id]}
                className="w-full mt-6 bg-charcoal text-background py-3 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:bg-primary shadow-soft disabled:opacity-100 disabled:bg-surface disabled:text-charcoal/50 disabled:translate-y-0 flex justify-center items-center gap-2"
              >
                {sentRequests[mentor._id] ? <><Check size={16} /> Request Sent</> : 'Request Swap'}
              </button>
            </motion.div>
          )))}
        </div>
      </main>
    </div>
  );
}
