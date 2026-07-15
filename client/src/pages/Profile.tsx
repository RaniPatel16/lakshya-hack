import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Settings, MapPin, Calendar, Link as LinkIcon, Globe, Briefcase, Video, Mic, Star, Zap, Edit3, X, Award, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skillsOffered: user?.skillsOffered?.join(', ') || '',
    skillsWanted: user?.skillsWanted?.join(', ') || ''
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Merge real user data with UI mocks
  const profile = {
    name: user?.name || "Alex Chen",
    role: user?.bio || "Continuous Learner",
    location: "San Francisco, CA (PST)",
    bio: user?.bio || "Passionate about crafting intuitive, premium user interfaces. I love teaching the intricacies of modern CSS and React performance. Currently looking to dive deep into backend architecture with Node and Go.",
    avatar: user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Alex'}&background=random`,
    banner: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop",
    rating: 4.9,
    completedSwaps: 12,
    xp: user?.xp || 2450,
    level: user?.level || 14,
    skillsOffered: user?.skillsOffered && user.skillsOffered.length > 0 
      ? user.skillsOffered.map((s: string) => ({ name: s, level: "Expert" }))
      : [
          { name: "React", level: "Expert" },
          { name: "Framer Motion", level: "Advanced" },
          { name: "Tailwind CSS", level: "Expert" }
        ],
    skillsWanted: user?.skillsWanted && user.skillsWanted.length > 0 
      ? user.skillsWanted.map((s: string) => ({ name: s, level: "Beginner" }))
      : [
          { name: "Node.js", level: "Beginner" },
          { name: "Go", level: "Beginner" },
          { name: "System Design", level: "Intermediate" }
        ],
    badges: ["Top 5% Mentor", "Fast Responder", "CSS Wizard"],
    availability: [
      { day: "Mon", slots: ["18:00", "19:00"] },
      { day: "Wed", slots: ["18:00"] },
      { day: "Sat", slots: ["10:00", "11:00", "14:00"] }
    ]
  };

  return (
    <div className="pb-24">
      {/* 1. Banner & Header */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img src={profile.banner} alt="Banner" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative -mt-32">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          
          {/* Avatar */}
          <div className="relative">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-background overflow-hidden bg-surface shadow-premium">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-4 right-4 w-8 h-8 bg-primary rounded-full border-4 border-background flex items-center justify-center text-background tooltip-trigger">
              <CheckCircle2 size={16} />
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 pt-4 md:pt-32">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-4xl font-bold text-charcoal">{profile.name}</h1>
                <p className="text-xl text-charcoal/70 mt-1">{profile.role}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium text-charcoal/60">
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> {profile.location}</span>
                  <span className="flex items-center gap-1.5 text-highlight"><Star size={16} fill="currentColor" /> {profile.rating} Rating</span>
                  <span className="flex items-center gap-1.5"><Calendar size={16} /> Joined Oct 2025</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-charcoal text-background px-5 py-2.5 rounded-full font-medium hover:bg-primary transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Edit3 size={18} /> Edit Profile
                </button>
                <button className="p-2.5 bg-surface text-charcoal rounded-full hover:bg-surface-hover transition-colors">
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          
          {/* Left Column (Bio, Links, Media) */}
          <div className="space-y-8">
            <div className="matte-surface p-8 rounded-3xl">
              <h3 className="text-lg font-semibold text-charcoal mb-4">About me</h3>
              <p className="text-charcoal/80 leading-relaxed">{profile.bio}</p>
              
              <div className="mt-8 space-y-4">
                <a href="#" className="flex items-center gap-3 text-charcoal/70 hover:text-primary transition-colors font-medium">
                  <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-charcoal"><LinkIcon size={18} /></div>
                  portfolio.design
                </a>
                <a href="#" className="flex items-center gap-3 text-charcoal/70 hover:text-primary transition-colors font-medium">
                  <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-charcoal"><Globe size={18} /></div>
                  github.com/alexchen
                </a>
                <a href="#" className="flex items-center gap-3 text-charcoal/70 hover:text-primary transition-colors font-medium">
                  <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-charcoal"><Briefcase size={18} /></div>
                  linkedin.com/in/alexchen
                </a>
              </div>
            </div>

            {/* Multimedia Intro */}
            <div className="matte-surface p-8 rounded-3xl">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Introductions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="aspect-square bg-surface-hover rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-background transition-colors group">
                  <Video size={28} className="text-charcoal/50 group-hover:text-background transition-colors" />
                  <span className="font-medium text-sm">Watch Video</span>
                </button>
                <button className="aspect-square bg-surface-hover rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-accent hover:text-background transition-colors group">
                  <Mic size={28} className="text-charcoal/50 group-hover:text-background transition-colors" />
                  <span className="font-medium text-sm">Listen to Bio</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Skills, Stats, Calendar) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-primary text-background p-6 rounded-3xl">
                <div className="flex items-center gap-2 mb-2 opacity-80"><Zap size={18} /> Level {profile.level}</div>
                <div className="text-3xl font-bold">{profile.xp.toLocaleString()} XP</div>
              </div>
              <div className="matte-surface p-6 rounded-3xl">
                <div className="flex items-center gap-2 text-charcoal/60 mb-2"><Award size={18} /> Swaps</div>
                <div className="text-3xl font-bold text-charcoal">{profile.completedSwaps}</div>
              </div>
              <div className="matte-surface p-6 rounded-3xl">
                <div className="flex items-center gap-2 text-charcoal/60 mb-2"><Star size={18} /> Rating</div>
                <div className="text-3xl font-bold text-charcoal">{profile.rating}</div>
              </div>
            </div>

            {/* Skills */}
            <div className="matte-surface p-8 rounded-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-5 uppercase tracking-wider text-sm">Skills I Offer</h3>
                  <div className="space-y-4">
                    {profile.skillsOffered.map(skill => (
                      <div key={skill.name} className="flex justify-between items-center bg-background px-4 py-3 rounded-xl border border-surface shadow-sm">
                        <span className="font-medium text-charcoal">{skill.name}</span>
                        <span className="text-xs font-bold px-2 py-1 bg-surface-hover text-primary rounded uppercase tracking-wide">{skill.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-5 uppercase tracking-wider text-sm">Skills I Want</h3>
                  <div className="space-y-4">
                    {profile.skillsWanted.map(skill => (
                      <div key={skill.name} className="flex justify-between items-center bg-background px-4 py-3 rounded-xl border border-surface shadow-sm">
                        <span className="font-medium text-charcoal">{skill.name}</span>
                        <span className="text-xs font-bold px-2 py-1 bg-surface-hover text-accent rounded uppercase tracking-wide">{skill.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="matte-surface p-8 rounded-3xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-charcoal">Weekly Availability</h3>
                <span className="text-xs font-medium bg-surface px-3 py-1 rounded-full text-charcoal/60">Pacific Time (PT)</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const avail = profile.availability.find(a => a.day === day);
                  return (
                    <div key={day} className={`flex flex-col items-center p-3 rounded-xl border ${avail ? 'border-primary/30 bg-primary/5' : 'border-surface bg-background opacity-50'}`}>
                      <span className="text-sm font-semibold mb-2">{day}</span>
                      {avail ? (
                        <div className="flex flex-col gap-1 w-full text-center">
                          {avail.slots.map(s => <span key={s} className="text-xs bg-primary text-background py-1 rounded">{s}</span>)}
                        </div>
                      ) : (
                        <span className="text-xs text-charcoal/40 mt-1">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-background rounded-[2.5rem] p-8 md:p-12 shadow-premium max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-8 right-8 p-2 bg-surface rounded-full hover:bg-surface-hover text-charcoal/60 hover:text-charcoal transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-3xl font-semibold text-charcoal mb-8">Edit Profile</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-surface rounded-xl px-4 py-3 outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Bio / Professional Role</label>
                  <textarea 
                    value={formData.bio} 
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    rows={3} 
                    className="w-full bg-background border border-surface rounded-xl px-4 py-3 outline-none focus:border-primary resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Skills You Offer (comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.skillsOffered} 
                    onChange={e => setFormData({...formData, skillsOffered: e.target.value})}
                    placeholder="e.g. React, Python, UI Design"
                    className="w-full bg-background border border-surface rounded-xl px-4 py-3 outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Skills You Want to Learn (comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.skillsWanted} 
                    onChange={e => setFormData({...formData, skillsWanted: e.target.value})}
                    placeholder="e.g. Node.js, Go, Marketing"
                    className="w-full bg-background border border-surface rounded-xl px-4 py-3 outline-none focus:border-primary" 
                  />
                </div>
                
                <div className="pt-6 border-t border-surface">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-primary text-background font-medium py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-soft disabled:opacity-70"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
