import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, BrainCircuit, Target, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  type?: 'default' | 'match_score' | 'roadmap' | 'improvement';
  data?: any;
};

export default function AIAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hi Alex! I am your SkillSphere AI. How can I help you swap skills today?',
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const query = input;
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    const queryLower = query.toLowerCase();
    
    // Hardcode some UI widgets for specific keywords
    if (queryLower.includes('match') || queryLower.includes('mentor')) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I found a perfect mentor for you based on your goal to learn Node.js.",
          type: 'match_score',
          data: { name: 'David Kim', score: 96, reasoning: 'David is an expert in Node.js and wants to learn Advanced CSS, which you offer. You share a timezone.' }
        }]);
      }, 1500);
      return;
    } else if (queryLower.includes('roadmap') || queryLower.includes('career')) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Here is your generated Career Roadmap to become a Full-Stack Developer.",
          type: 'roadmap',
          data: { steps: ['Master Express.js Basics', 'Understand JWT Auth', 'Learn MongoDB/Mongoose', 'Deploy to Render'] }
        }]);
      }, 1500);
      return;
    } else if (queryLower.includes('improve') && queryLower.includes('profile')) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I analyzed your profile. Here are some quick wins to increase your match rate:",
          type: 'improvement',
          data: { tips: ['Add a portfolio link', 'Be more specific about your CSS level', 'Add weekend availability'] }
        }]);
      }, 1500);
      return;
    }

    // Dynamic response from Gemini backend for all other queries
    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          message: query,
          context: user
        })
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: data.reply || "Sorry, I didn't get that."
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: "I am having connection issues right now. Please try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-charcoal text-background rounded-full shadow-premium flex items-center justify-center z-40 transition-transform ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 w-full max-w-sm md:max-w-md h-[600px] max-h-[80vh] bg-background border border-surface shadow-premium rounded-[2rem] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface bg-background z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-charcoal text-background flex items-center justify-center shadow-soft">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal leading-tight">SkillSphere AI</h3>
                  <p className="text-xs text-primary font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface transition-colors text-charcoal/60"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface/30">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${msg.sender === 'user' ? 'bg-primary text-background' : 'bg-background border border-surface'} rounded-2xl p-4 shadow-sm`}>
                    
                    {/* Standard Text */}
                    <p className={`text-sm ${msg.sender === 'user' ? 'text-background' : 'text-charcoal'}`}>
                      {msg.text}
                    </p>

                    {/* AI Match Widget */}
                    {msg.type === 'match_score' && msg.data && (
                      <div className="mt-4 bg-surface p-3 rounded-xl border border-primary/20">
                        <div className="flex items-center gap-2 mb-2 font-semibold text-charcoal text-sm">
                          <Target size={16} className="text-highlight" /> Recommended Match
                        </div>
                        <div className="text-sm font-medium text-charcoal mb-1">{msg.data.name}</div>
                        <div className="text-2xl font-bold text-highlight mb-2">{msg.data.score}% Match</div>
                        <p className="text-xs text-charcoal/70">{msg.data.reasoning}</p>
                        <button className="w-full mt-3 bg-charcoal text-background py-2 rounded-lg text-xs font-medium hover:bg-primary transition-colors">
                          View Profile
                        </button>
                      </div>
                    )}

                    {/* AI Roadmap Widget */}
                    {msg.type === 'roadmap' && msg.data && (
                      <div className="mt-4 space-y-2">
                        {msg.data.steps.map((step: string, i: number) => (
                          <div key={i} className="flex gap-3 bg-surface p-2 rounded-lg items-center">
                            <div className="w-6 h-6 rounded-full bg-background border border-surface flex items-center justify-center text-xs font-bold text-charcoal/50">
                              {i + 1}
                            </div>
                            <span className="text-xs font-medium text-charcoal">{step}</span>
                          </div>
                        ))}
                        <button className="w-full mt-2 bg-background border border-surface text-charcoal py-2 rounded-lg text-xs font-medium hover:bg-surface transition-colors">
                          Save to Dashboard
                        </button>
                      </div>
                    )}

                    {/* AI Profile Tip Widget */}
                    {msg.type === 'improvement' && msg.data && (
                      <div className="mt-4 bg-accent/5 border border-accent/20 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 font-semibold text-accent text-sm">
                          <Lightbulb size={16} /> Profile Optimizations
                        </div>
                        <ul className="list-disc list-inside text-xs text-charcoal/70 space-y-1">
                          {msg.data.tips.map((tip: string, i: number) => <li key={i}>{tip}</li>)}
                        </ul>
                      </div>
                    )}

                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-background border border-surface rounded-2xl p-4 shadow-sm flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-charcoal/40 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-charcoal/40 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-charcoal/40 rounded-full" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t border-surface">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask for a mentor match..."
                  className="w-full bg-surface border border-surface rounded-full pl-4 pr-12 py-3 text-sm outline-none focus:border-primary transition-colors text-charcoal"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 w-8 h-8 bg-charcoal text-background rounded-full flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-50 disabled:hover:bg-charcoal"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
