import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check, X, Clock, Trash2, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

type SwapStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';

interface Swap {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  skillOffered: string;
  skillWanted: string;
  status: SwapStatus;
  date: string;
  type: 'sent' | 'received';
}

export default function Swaps() {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchSwaps();
  }, [user]);

  const fetchSwaps = async () => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:5000/api/swaps', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      
      const formattedSwaps = data.map((s: any) => {
        const isSent = s.requester._id === user._id;
        const partner = isSent ? s.receiver : s.requester;
        
        return {
          id: s._id,
          partnerName: partner.name,
          partnerAvatar: partner.avatar || `https://ui-avatars.com/api/?name=${partner.name}&background=random`,
          skillOffered: s.skillOffered,
          skillWanted: s.skillWanted,
          status: s.status,
          date: new Date(s.createdAt).toLocaleDateString(),
          type: isSent ? 'sent' : 'received'
        };
      });
      setSwaps(formattedSwaps);
    } catch (error) {
      console.error("Failed to fetch swaps", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: SwapStatus) => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/swaps/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setSwaps(swaps.map(s => s.id === id ? { ...s, status: newStatus } : s));
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const deleteSwap = (id: string) => {
    // Optional: implement delete on backend if endpoint exists. For now just hide it.
    setSwaps(swaps.filter(s => s.id !== id));
  };

  const filteredSwaps = filter === 'all' ? swaps : swaps.filter(s => s.status === filter);

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-primary mb-2">Your Swaps</h1>
          <p className="text-secondary">Manage your active and past skill exchanges.</p>
        </div>
        
        <div className="flex bg-surface border border-border p-1 rounded-xl">
          {['all', 'pending', 'accepted', 'completed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-background text-primary shadow-sm border border-border' : 'text-secondary hover:text-primary border border-transparent'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {loading ? (
            <div className="text-center py-20 text-secondary">Loading swaps...</div>
          ) : filteredSwaps.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-background border border-dashed border-border rounded-3xl">
              <RefreshCw size={48} className="mx-auto text-surface-hover mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">No swaps found</h3>
              <p className="text-secondary">You don't have any {filter !== 'all' ? filter : ''} swaps yet.</p>
            </motion.div>
          ) : (
            filteredSwaps.map((swap) => (
              <SwapCard 
                key={swap.id} 
                swap={swap} 
                onUpdate={updateStatus} 
                onDelete={deleteSwap} 
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SwapCard({ swap, onUpdate, onDelete }: { swap: Swap, onUpdate: (id: string, s: SwapStatus) => void, onDelete: (id: string) => void }) {
  const statusColors = {
    pending: 'bg-orange-100 text-orange-600 border-orange-200',
    accepted: 'bg-green-100 text-green-700 border-green-200',
    completed: 'bg-surface text-secondary border-border',
    rejected: 'bg-red-50 text-red-600 border-red-100',
    cancelled: 'bg-surface text-secondary border-border'
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-premium transition-shadow group relative overflow-hidden"
    >
      {/* Decorative gradient for accepted status */}
      {swap.status === 'accepted' && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      )}

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
        
        {/* User Info & Skills */}
        <div className="flex gap-4 items-center">
          <img src={swap.partnerAvatar} alt={swap.partnerName} className="w-16 h-16 rounded-full border-2 border-border object-cover" />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-semibold text-primary">{swap.partnerName}</h3>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusColors[swap.status]}`}>
                {swap.status}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="font-medium text-primary bg-surface border border-border px-2 py-1 rounded">{swap.type === 'received' ? swap.skillOffered : swap.skillWanted}</span>
              <ArrowRightLeft size={14} className="text-secondary" />
              <span className="font-medium text-background bg-primary/90 px-2 py-1 rounded">{swap.type === 'received' ? swap.skillWanted : swap.skillOffered}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons based on Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-secondary mr-2">
            <Clock size={14} /> {swap.date}
          </div>

          {swap.status === 'pending' && swap.type === 'received' && (
            <>
              <button onClick={() => onUpdate(swap.id, 'accepted')} className="flex items-center gap-1.5 bg-primary text-background px-4 py-2 rounded-xl text-sm font-medium hover:bg-highlight transition-colors shadow-sm">
                <Check size={16} /> Accept
              </button>
              <button onClick={() => onUpdate(swap.id, 'rejected')} className="flex items-center gap-1.5 bg-surface border border-border text-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors">
                <X size={16} /> Decline
              </button>
            </>
          )}

          {swap.status === 'pending' && swap.type === 'sent' && (
            <>
              <button onClick={() => onUpdate(swap.id, 'accepted')} className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors">
                <Check size={16} /> Simulate Partner Accepting
              </button>
              <button onClick={() => onUpdate(swap.id, 'cancelled')} className="flex items-center gap-1.5 bg-surface border border-border text-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-hover transition-colors">
                <X size={16} /> Cancel Request
              </button>
            </>
          )}

          {swap.status === 'accepted' && (
            <>
              <Link to="/messages" className="flex items-center gap-1.5 bg-primary text-background px-4 py-2 rounded-xl text-sm font-medium hover:bg-highlight transition-colors shadow-sm">
                Open Chat
              </Link>
              <button onClick={() => onUpdate(swap.id, 'completed')} className="flex items-center gap-1.5 bg-surface border border-border text-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-hover transition-colors">
                Mark Done
              </button>
            </>
          )}

          {(swap.status === 'rejected' || swap.status === 'cancelled') && (
            <button onClick={() => onDelete(swap.id)} className="flex items-center gap-1.5 text-secondary hover:text-red-500 p-2 rounded-lg transition-colors">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
