import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Zap, ChevronDown, Flame, Check, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MatchScore from '../components/MatchScore';

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
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [swapMessage, setSwapMessage] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [trendingSkills, setTrendingSkills] = useState<string[]>(['Generative AI', 'React Server Components', 'Figma Variables', 'System Design', 'Rust']);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [usersRes, swapsRes, trendingRes] = await Promise.all([
          fetch('http://localhost:5000/api/users', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5000/api/swaps', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5000/api/ai/trending-skills', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);
        
        const usersData = await usersRes.json();
        const swapsData = await swapsRes.json();
        const trendingData = await trendingRes.json();
        
        setMentors(usersData);
        if (trendingData.skills) {
          setTrendingSkills(trendingData.skills);
        }
        
        const existingRequests: Record<string, boolean> = {};
        swapsData.forEach((swap: any) => {
          if (swap.requester._id === user._id || swap.requester === user._id) {
             const receiverId = swap.receiver._id || swap.receiver;
             existingRequests[receiverId] = true;
          }
        });
        setSentRequests(existingRequests);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleOpenModal = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setSwapMessage(`Hi ${mentor.name}, I'd love to swap skills with you!`);
  };

  const handleDraftAI = async () => {
    if (!user || !selectedMentor) return;
    setIsDrafting(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/draft-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          senderName: user.name,
          senderSkills: user.skillsOffered,
          receiverName: selectedMentor.name,
          receiverSkills: selectedMentor.skillsOffered
        })
      });
      const data = await response.json();
      if (data.draft) {
        setSwapMessage(data.draft);
      }
    } catch (error) {
      console.error("Failed to draft message", error);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleConfirmSwap = async () => {
    if (!user || !selectedMentor) return;
    const skillOffered = user.skillsOffered?.[0] || 'My Skill';
    const skillWanted = selectedMentor.skillsOffered?.[0] || 'Their Skill';
    
    try {
      const response = await fetch('http://localhost:5000/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          receiverId: selectedMentor._id,
          skillOffered,
          skillWanted,
          message: swapMessage
        })
      });
      if (response.ok) {
        setSentRequests(prev => ({ ...prev, [selectedMentor._id]: true }));
        setSelectedMentor(null);
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
          <h2 className="text-2xl font-semibold text-primary mb-6">Explore</h2>
          
          {/* Search */}
          <div className="relative mb-8">
            <input 
              type="text" 
              placeholder="Search skills, people..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-colors text-primary shadow-sm"
            />
            <Search className="absolute left-3 top-3.5 text-secondary" size={18} />
          </div>

          {/* Filters */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Availability</h3>
              <div className="space-y-2">
                {['Anytime', 'Weekends', 'Weekdays', 'Evenings (PT)'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-secondary cursor-pointer hover:text-primary transition-colors">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/20" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Location</h3>
              <div className="space-y-2">
                {['Remote / Anywhere', 'North America', 'Europe', 'Asia Pacific'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-secondary cursor-pointer hover:text-primary transition-colors">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/20" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Rating</h3>
              <div className="flex gap-2">
                {[4, 4.5, 4.8].map(rt => (
                  <button key={rt} className="flex-1 bg-surface border border-border hover:bg-surface-hover text-primary text-sm font-medium py-2 rounded-lg transition-colors flex justify-center items-center gap-1">
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
        <div className="mb-10 p-6 bg-surface rounded-[2rem] border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/5 rounded-full blur-[80px]"></div>
          <div className="relative z-10">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-primary mb-4">
              <Flame className="text-highlight" /> Trending Skills this week
            </h3>
            <div className="flex flex-wrap gap-3">
              {trendingSkills.map((skill, i) => (
                <button key={i} className="bg-background px-4 py-2 rounded-full text-sm font-medium text-secondary hover:text-primary hover:border-primary/30 transition-colors shadow-sm border border-border">
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Header Options */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-secondary font-medium">Showing {mentors.length} potential matches</p>
          <button className="flex items-center gap-2 text-sm font-medium text-primary hover:text-highlight transition-colors">
            Sort by: AI Match <ChevronDown size={16} />
          </button>
        </div>

        {/* Masonry Grid of User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
          {loading ? (
            <div className="col-span-full py-20 text-center text-secondary">Loading users...</div>
          ) : (
            mentors.map((mentor, i) => (
            <motion.div 
              key={mentor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-background rounded-[2rem] p-6 shadow-sm border border-border hover:shadow-premium hover:border-surface-hover transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <img src={mentor.avatar || `https://ui-avatars.com/api/?name=${mentor.name}&background=random`} alt={mentor.name} className="w-12 h-12 rounded-full border-2 border-surface object-cover" />
                  <div>
                    <h3 className="font-semibold text-primary text-lg">{mentor.name}</h3>
                    <p className="text-xs text-secondary">{mentor.bio || "Enthusiastic Learner"}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <MatchScore partnerSkills={mentor.skillsOffered || []} />
                  <div className="flex items-center gap-1 text-xs font-medium text-secondary">
                    <Star size={10} className="text-highlight" fill="currentColor" /> {(Math.random() * 1 + 4).toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-secondary flex items-center gap-1 mb-5">
                <MapPin size={12} /> Remote / Anywhere
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-2">Can Teach</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.skillsOffered?.length > 0 ? mentor.skillsOffered.map(skill => (
                      <span key={skill} className="bg-surface text-primary px-2.5 py-1 rounded text-xs font-medium border border-border">{skill}</span>
                    )) : <span className="text-xs text-secondary italic">No skills listed</span>}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-2">Wants to Learn</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.skillsWanted?.length > 0 ? mentor.skillsWanted.map(skill => (
                      <span key={skill} className="bg-primary/5 text-primary px-2.5 py-1 rounded text-xs font-medium border border-primary/10">{skill}</span>
                    )) : <span className="text-xs text-secondary italic">No skills listed</span>}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleOpenModal(mentor)}
                disabled={sentRequests[mentor._id]}
                className="w-full mt-6 bg-primary text-background py-3 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:bg-highlight shadow-soft disabled:opacity-100 disabled:bg-surface disabled:text-secondary disabled:translate-y-0 flex justify-center items-center gap-2"
              >
                {sentRequests[mentor._id] ? <><Check size={16} /> Request Sent</> : 'Request Swap'}
              </button>
            </motion.div>
          )))}
        </div>
      </main>

      {/* Swap Request Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-surface border border-border rounded-3xl p-8 shadow-premium max-w-lg w-full relative"
          >
            <button onClick={() => setSelectedMentor(null)} className="absolute top-6 right-6 text-secondary hover:text-primary"><X size={20}/></button>
            <h3 className="text-2xl font-semibold text-primary mb-2">Request Skill Swap</h3>
            <p className="text-secondary mb-6">Send a message to {selectedMentor.name} to propose a swap.</p>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-primary">Your Message</label>
                <button onClick={handleDraftAI} disabled={isDrafting} className="flex items-center gap-1.5 text-xs font-semibold text-highlight hover:text-highlight/80 transition-colors disabled:opacity-50">
                  <Sparkles size={14} /> {isDrafting ? 'Drafting...' : 'Draft with AI'}
                </button>
              </div>
              <textarea 
                value={swapMessage}
                onChange={(e) => setSwapMessage(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-4 min-h-[120px] outline-none focus:border-primary transition-colors text-primary text-sm"
              />
            </div>

            <button onClick={handleConfirmSwap} className="w-full bg-primary text-background py-3 rounded-xl font-medium hover:bg-highlight transition-colors">
              Send Request
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
