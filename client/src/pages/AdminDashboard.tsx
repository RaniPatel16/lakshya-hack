import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldAlert, BarChart3, Download, Send, Search, MoreHorizontal, Shield, ArrowUpRight, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [platformUsers, setPlatformUsers] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        setPlatformUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-surface pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 text-charcoal/60">
            <Shield size={18} />
            <span className="text-sm font-medium uppercase tracking-widest">Enterprise Admin</span>
          </div>
          <h1 className="text-3xl font-display font-semibold text-charcoal">Platform Overview</h1>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-surface text-charcoal px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors">
            <Send size={16} /> Announcement
          </button>
          <button className="flex items-center gap-2 bg-charcoal text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Top Stats - Vercel Style Minimal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: (platformUsers.length + 1).toString(), change: '+12%', icon: <Users size={16} /> },
          { label: 'Active Swaps', value: '3,842', change: '+5%', icon: <Activity size={16} /> },
          { label: 'Reports', value: '14', change: '-2%', icon: <ShieldAlert size={16} /> },
          { label: 'Platform Match Rate', value: '94%', change: '+1%', icon: <BarChart3 size={16} /> },
        ].map((stat, i) => (
          <div key={i} className="bg-background border border-surface rounded-xl p-5 hover:border-surface-hover transition-colors">
            <div className="flex justify-between items-center mb-4 text-charcoal/60">
              <span className="text-sm font-medium">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-semibold text-charcoal">{stat.value}</div>
              <div className="text-xs font-medium text-primary flex items-center">{stat.change} <ArrowUpRight size={12} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-surface mb-8">
        {['users', 'moderation', 'analytics', 'settings'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal/50 hover:text-charcoal'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content: Users */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-xs">
              <input type="text" placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2 border border-surface rounded-lg text-sm outline-none focus:border-charcoal transition-colors bg-background" />
              <Search className="absolute left-3 top-2.5 text-charcoal/40" size={16} />
            </div>
            <button className="text-sm font-medium text-charcoal/60 flex items-center gap-1 hover:text-charcoal transition-colors">
              Filter <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="bg-background border border-surface rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface/30 text-charcoal/60 border-b border-surface">
                <tr>
                  <th className="font-medium px-6 py-3">User</th>
                  <th className="font-medium px-6 py-3">Role</th>
                  <th className="font-medium px-6 py-3">Status</th>
                  <th className="font-medium px-6 py-3">Swaps</th>
                  <th className="font-medium px-6 py-3">Joined</th>
                  <th className="font-medium px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {platformUsers.map(u => (
                  <tr key={u._id} className="hover:bg-surface/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-charcoal">{u.name}</div>
                      <div className="text-charcoal/50 text-xs">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 text-charcoal/80">User</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium border bg-green-50 text-green-700 border-green-100">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-charcoal/80">{u.xp || 0} XP</td>
                    <td className="px-6 py-4 text-charcoal/80">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-charcoal/40 hover:text-charcoal transition-colors p-1">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4 text-xs text-charcoal/50">
            <span>Showing {platformUsers.length} users</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-surface rounded hover:bg-surface transition-colors disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 border border-surface rounded hover:bg-surface transition-colors">Next</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Content: Placeholder for others */}
      {activeTab !== 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center border border-dashed border-surface rounded-xl">
          <BarChart3 size={32} className="mx-auto text-surface-hover mb-4" />
          <h3 className="text-lg font-medium text-charcoal mb-1">Coming Soon</h3>
          <p className="text-sm text-charcoal/50">The {activeTab} module is currently under development.</p>
        </motion.div>
      )}

    </div>
  );
}
