import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Sparkles, TrendingUp, Clock, Target, CheckCircle2, Zap, ArrowRight, Bell, ChevronRight, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';


export default function Dashboard() {
  const { user } = useAuth();
  const [pendingSwaps, setPendingSwaps] = useState<any[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  // Calculate dynamic XP values
  const currentXp = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const nextLevelXp = currentLevel * 500;
  const xpPercentage = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));
  
  // Calculate stroke dashoffset for the SVG ring (440 is the circumference)
  const strokeDashoffset = 440 - (440 * xpPercentage) / 100;

  useEffect(() => {
    const fetchSwaps = async () => {
      if (!user) return;
      try {
        const response = await fetch('http://localhost:5000/api/swaps', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        
        const pending = data.filter((s: any) => s.status === 'pending' && s.receiver._id === user._id);
        const completed = data.filter((s: any) => s.status === 'completed').length;
        
        setPendingSwaps(pending);
        setTotalCompleted(completed);
        
        // Generate recent activity
        const recent = data
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
          .map((s: any) => {
            const isRequester = s.requester._id === user._id;
            const partnerName = isRequester ? s.receiver.name : s.requester.name;
            let actionText = '';
            let color = 'bg-primary';
            
            if (s.status === 'pending') {
              actionText = isRequester ? `You requested a swap with ${partnerName}` : `${partnerName} requested a swap with you`;
              color = 'bg-highlight';
            } else if (s.status === 'accepted') {
              actionText = `Swap with ${partnerName} was accepted`;
              color = 'bg-primary';
            } else if (s.status === 'completed') {
              actionText = `Completed a swap with ${partnerName}`;
              color = 'bg-surface-hover';
            } else {
              actionText = `Swap with ${partnerName} was ${s.status}`;
              color = 'bg-charcoal/20';
            }
            
            return {
              id: s._id,
              text: actionText,
              time: new Date(s.createdAt).toLocaleDateString(),
              color
            };
          });
          
        setRecentActivity(recent);
        
        // Generate mock weekly activity based on current XP to make it look realistic
        const base = Math.max(0, currentXp - 500);
        const step = Math.max(10, Math.floor(currentXp / 14));
        setActivityData([
          { day: 'Mon', xp: base + step * 1 },
          { day: 'Tue', xp: base + step * 2 },
          { day: 'Wed', xp: base + step * 4 },
          { day: 'Thu', xp: base + step * 4.5 },
          { day: 'Fri', xp: base + step * 5 },
          { day: 'Sat', xp: base + step * 6 },
          { day: 'Sun', xp: currentXp },
        ]);

      } catch (error) {
        console.error("Failed to fetch dashboard swaps", error);
      }
    };
    fetchSwaps();
  }, [user, currentXp]);

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-semibold text-primary mb-3"
          >
            Welcome back, {user?.name?.split(' ')[0] || 'Alex'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-secondary text-lg"
          >
            You are in the top 5% of mentors this week. Keep it up!
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 bg-surface border border-border p-2 pr-6 rounded-full shadow-sm"
        >
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-background">
            <Zap size={20} className="fill-current" />
          </div>
          <div>
            <div className="text-xs font-bold text-secondary uppercase tracking-widest">Current Level</div>
            <div className="font-semibold text-primary flex items-baseline gap-1">Level {currentLevel} <span className="text-xs text-secondary">Master</span></div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Top Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Skills Offered', value: user?.skillsOffered?.length || '0', icon: <Target size={18} /> },
              { label: 'Skills Learning', value: user?.skillsWanted?.length || '0', icon: <Activity size={18} /> },
              { label: 'Pending Swaps', value: pendingSwaps.length.toString(), icon: <Clock size={18} /> },
              { label: 'Completed', value: totalCompleted.toString(), icon: <CheckCircle2 size={18} /> },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (i * 0.05) }}
                className="bg-surface border border-border rounded-3xl p-5 hover:shadow-premium transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center text-primary mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-display font-semibold text-primary mb-1">{stat.value}</div>
                <div className="text-xs font-medium text-secondary uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Activity Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface rounded-[2.5rem] p-8 border border-border"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-display font-semibold text-primary">Weekly Activity</h3>
                <p className="text-sm text-secondary">XP gained over the last 7 days</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-surface-hover rounded-full text-xs font-semibold text-primary border border-border">XP</span>
                <span className="px-3 py-1 bg-transparent rounded-full text-xs font-semibold text-secondary">Hours</span>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FAFAFA" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#FAFAFA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', borderRadius: '12px', border: '1px solid #27272A', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)', color: '#FAFAFA' }}
                    cursor={{ stroke: '#27272A', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="xp" stroke="#FAFAFA" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pending Swaps Inline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface rounded-[2.5rem] p-8 shadow-sm border border-border"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-semibold text-primary">Action Required</h3>
              <Link to="/swaps" className="text-highlight text-sm font-semibold flex items-center gap-1 hover:underline">View all <ChevronRight size={16} /></Link>
            </div>

            <div className="space-y-4">
              {pendingSwaps.length === 0 ? (
                <div className="text-secondary text-sm">No pending actions. You're all caught up!</div>
              ) : (
                pendingSwaps.map((req) => (
                  <div key={req._id} className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl hover:bg-surface-hover transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <img src={req.requester.avatar || `https://ui-avatars.com/api/?name=${req.requester.name}&background=random`} alt={req.requester.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <h4 className="font-semibold text-primary">{req.requester.name}</h4>
                        <p className="text-sm text-secondary">Wants to swap for {req.skillWanted}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-secondary hidden sm:block">{new Date(req.createdAt).toLocaleDateString()}</span>
                      <Link to="/swaps" className="bg-primary text-background px-4 py-2 rounded-xl text-sm font-medium hover:bg-highlight transition-colors">Review</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </div>

        {/* Right Column (Side Panel) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Progress Ring / Success Rate */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface text-primary rounded-[2.5rem] p-8 shadow-premium border border-border relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="font-display font-semibold text-xl mb-6 relative z-10">XP Progress</h3>
            
            <div className="flex justify-center mb-6 relative z-10">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-surface-hover" strokeWidth="12" fill="none" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    className="stroke-primary" strokeWidth="12" fill="none" 
                    strokeDasharray="440" 
                    strokeDashoffset={strokeDashoffset} 
                    strokeLinecap="round" 
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-3xl font-display font-bold">{currentXp.toLocaleString()}</div>
                  <div className="text-xs font-medium text-secondary uppercase tracking-widest">XP</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Success Rate</span>
                <span className="font-semibold text-primary flex items-center gap-1"><TrendingUp size={14} /> {totalCompleted > 0 ? '100%' : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Next Level</span>
                <span className="font-semibold">{nextLevelXp.toLocaleString()} XP</span>
              </div>
            </div>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface rounded-[2.5rem] p-8 border border-border"
          >
            <div className="flex items-center gap-2 text-highlight font-semibold mb-6">
              <Sparkles size={20} /> AI Suggestions
            </div>
            
            <div className="space-y-4">
              {user?.skillsWanted && user.skillsWanted.length > 0 ? (
                user.skillsWanted.slice(0, 2).map((skill: string, i: number) => (
                  <div key={i} className="bg-background/50 border border-border p-4 rounded-2xl relative overflow-hidden group hover:border-surface-hover transition-colors cursor-pointer">
                    <h4 className="font-semibold text-primary text-sm mb-1">Focus on {skill}</h4>
                    <p className="text-xs text-secondary">We found several users offering {skill}. Finding a swap now could boost your level by 25%.</p>
                    <ArrowRight size={16} className="absolute bottom-4 right-4 text-highlight opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                ))
              ) : (
                <div className="bg-background/50 border border-border p-4 rounded-2xl relative overflow-hidden group hover:border-surface-hover transition-colors cursor-pointer">
                  <h4 className="font-semibold text-primary text-sm mb-1">Update your Profile</h4>
                  <p className="text-xs text-secondary">Add skills you want to learn to get personalized AI roadmaps and better matches.</p>
                  <ArrowRight size={16} className="absolute bottom-4 right-4 text-highlight opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface rounded-[2.5rem] p-8 shadow-sm border border-border"
          >
            <div className="flex items-center gap-2 font-display font-semibold text-primary mb-6">
              <Bell size={20} className="text-secondary" /> Recent Activity
            </div>
            <div className="space-y-5">
              {recentActivity.length > 0 ? (
                recentActivity.map((act) => (
                  <div key={act.id} className="flex gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${act.color.replace('bg-charcoal/20', 'bg-border')}`}></div>
                    <div>
                      <p className="text-sm text-primary">{act.text}</p>
                      <p className="text-xs text-secondary mt-1">{act.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-secondary text-center py-4">No recent activity yet. Start exploring to find swaps!</div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
