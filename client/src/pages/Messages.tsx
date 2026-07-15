import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Smile, Mic, Video, Calendar as CalendarIcon, Info, Phone, MoreVertical, FileText, Sparkles, Check, Clock, X } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
};

type Contact = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  msg: string;
  time: string;
  unread: boolean;
};

export default function Messages() {
  const [message, setMessage] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeRoom, setActiveRoom] = useState('room_sarah');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      try {
        const response = await fetch('http://localhost:5000/api/swaps', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        const accepted = data.filter((s: any) => s.status === 'accepted');
        
        const formattedContacts = accepted.map((s: any) => {
          const isSent = s.requester._id === user._id;
          const partner = isSent ? s.receiver : s.requester;
          return {
            id: partner._id,
            name: partner.name,
            role: partner.bio || 'Learner',
            avatar: partner.avatar || `https://ui-avatars.com/api/?name=${partner.name}&background=random`,
            msg: `Swap for ${isSent ? s.skillOffered : s.skillWanted}`,
            time: new Date(s.createdAt).toLocaleDateString(),
            unread: false
          };
        });
        setContacts(formattedContacts);
        if (formattedContacts.length > 0) {
          setActiveRoom(`room_${formattedContacts[0].id}`);
        }
      } catch (error) {
        console.error("Failed to fetch contacts", error);
      }
    };
    fetchContacts();
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.emit('join_room', activeRoom);

      const handleReceiveMessage = (data: any) => {
        setChatMessages(prev => {
          // Prevent duplicate messages if we already added it locally
          if (prev.some(m => m.id === data.id)) return prev;
          
          return [...prev, {
            id: data.id || Date.now().toString(),
            sender: data.sender,
            text: data.text,
            time: data.time,
            isMe: false
          }];
        });
      };

      socket.on('receive_message', handleReceiveMessage);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [socket, activeRoom]);

  // Fetch historical messages when room changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !activeRoom) return;
      try {
        const response = await fetch(`http://localhost:5000/api/messages/${activeRoom}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        
        const formatted = data.map((m: any) => ({
          id: m._id,
          sender: m.senderName,
          text: m.text,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: m.senderId === user._id
        }));
        
        setChatMessages(formatted);
      } catch (err) {
        console.error("Failed to fetch historical messages", err);
      }
    };
    fetchMessages();
  }, [activeRoom, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (!message.trim() || !user) return;
    
    const newMsg = {
      room: activeRoom,
      senderId: user._id,
      sender: user.name,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (socket) {
      socket.emit('send_message', newMsg);
    }

    // Optimistically add to UI
    setChatMessages(prev => [...prev, { id: `temp_${Date.now()}`, ...newMsg, isMe: true }]);
    setMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-14rem)] border border-surface rounded-[2rem] overflow-hidden shadow-sm bg-background mt-8 relative z-0">
      
      {/* Sidebar: Chat List */}
      <div className="w-80 border-r border-surface bg-background flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-surface">
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="w-full bg-surface border border-surface rounded-xl px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="p-6 text-center text-charcoal/50 text-sm">No accepted swaps to chat with yet.</div>
          ) : (
            contacts.map((chat, i) => (
              <div 
                key={chat.id} 
                onClick={() => setActiveRoom(`room_${chat.id}`)}
                className={`flex items-center gap-3 p-4 border-b border-surface/50 cursor-pointer transition-colors ${activeRoom === `room_${chat.id}` ? 'bg-surface/50 border-l-4 border-l-primary' : 'hover:bg-surface/30 border-l-4 border-l-transparent'}`}
              >
                <div className="relative">
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full border border-surface object-cover" />
                  {chat.unread && <span className="absolute top-0 right-0 w-3 h-3 bg-primary border-2 border-background rounded-full"></span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold text-charcoal text-sm truncate">{chat.name}</h4>
                    <span className="text-xs text-charcoal/50">{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread ? 'font-semibold text-charcoal' : 'text-charcoal/60'}`}>{chat.msg}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background/50 relative">
        
        {/* Chat Header */}
        <div className="h-16 border-b border-surface bg-background flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-charcoal text-lg">
              {contacts.find(c => `room_${c.id}` === activeRoom)?.name || 'Select a chat'}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-charcoal/50">
            <button className="p-2 hover:bg-surface rounded-full transition-colors tooltip-trigger"><Phone size={18} /></button>
            <button className="p-2 hover:bg-surface rounded-full transition-colors tooltip-trigger"><Video size={18} /></button>
            <button onClick={() => setShowBookingModal(true)} className="p-2 hover:bg-surface text-primary rounded-full transition-colors tooltip-trigger"><CalendarIcon size={18} /></button>
            <button className="p-2 hover:bg-surface rounded-full transition-colors tooltip-trigger"><Info size={18} /></button>
            <button className="p-2 hover:bg-surface rounded-full transition-colors tooltip-trigger"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center text-xs text-charcoal/40 font-medium my-4">Today</div>
          
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex items-start gap-4 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              <img src={msg.isMe ? "https://i.pravatar.cc/150?img=11" : "https://i.pravatar.cc/150?img=47"} className="w-10 h-10 rounded-full object-cover" />
              <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-baseline gap-2 mb-1 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                  <span className="font-semibold text-charcoal">{msg.sender}</span>
                  <span className="text-xs text-charcoal/40">{msg.time}</span>
                </div>
                <div className={`p-3 max-w-md ${msg.isMe ? 'bg-primary text-background rounded-2xl rounded-tr-none' : 'bg-surface text-charcoal rounded-2xl rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-surface">
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="bg-surface rounded-2xl border border-surface-hover p-2 flex flex-col transition-colors focus-within:border-primary/50 focus-within:bg-background">
            <input 
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-transparent px-3 py-2 text-sm outline-none text-charcoal"
            />
            <div className="flex justify-between items-center px-2 pt-2 border-t border-surface/50">
              <div className="flex items-center gap-1 text-charcoal/50">
                <button className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors"><Paperclip size={18} /></button>
                <button className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors"><Mic size={18} /></button>
                <button className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors"><Smile size={18} /></button>
              </div>
              <button 
                type="submit"
                disabled={!message.trim()}
                className="bg-primary text-background p-2 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </div>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-charcoal/40 font-medium">Press <kbd className="font-mono bg-surface px-1 py-0.5 rounded">Enter</kbd> to send, <kbd className="font-mono bg-surface px-1 py-0.5 rounded">Shift + Enter</kbd> for new line</span>
          </div>
        </div>

        {/* Session Booking Modal */}
        {showBookingModal && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-background border border-surface rounded-3xl p-8 shadow-premium max-w-md w-full relative"
            >
              <button onClick={() => setShowBookingModal(false)} className="absolute top-6 right-6 text-charcoal/40 hover:text-charcoal"><X size={20}/></button>
              <h3 className="text-2xl font-semibold text-charcoal mb-6">Schedule Session</h3>
              
              <div className="bg-highlight/10 border border-highlight/20 p-4 rounded-2xl mb-6">
                <div className="flex items-center gap-2 text-highlight font-semibold text-sm mb-2">
                  <Sparkles size={16} /> AI Suggested Time
                </div>
                <p className="text-sm text-charcoal/80 mb-3">Based on both of your availability calendars, you share a free slot tomorrow evening.</p>
                <button className="w-full bg-highlight text-background py-2 rounded-xl text-sm font-medium hover:bg-highlight/90 transition-colors flex items-center justify-center gap-2">
                  <Check size={16} /> Book Tomorrow, 18:00 PT
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-surface flex-1"></div>
                <span className="text-xs font-semibold text-charcoal/40 uppercase tracking-widest">Or pick manually</span>
                <div className="h-px bg-surface flex-1"></div>
              </div>

              <button className="w-full bg-surface text-charcoal py-3 rounded-xl text-sm font-medium hover:bg-surface-hover transition-colors flex items-center justify-center gap-2">
                <CalendarIcon size={16} /> Open Full Calendar
              </button>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
