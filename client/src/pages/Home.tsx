import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Brain, Zap, CheckCircle2, ChevronDown, Star, ArrowUpRight, Code, PenTool, Database, Layout, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="flex flex-col gap-32 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 md:pt-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full matte-surface text-sm font-medium mb-10 border border-primary/10 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          SkillSphere 2.0 is Live
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-semibold tracking-tight text-charcoal max-w-5xl leading-[1.05]"
        >
          Learn what you need. <br/>
          <span className="text-primary italic font-serif">Teach what you know.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-xl md:text-2xl text-charcoal/60 max-w-3xl font-light"
        >
          The first AI-powered skill swap platform. We match you with the exact mentor you need, based on what you can offer in return.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/signup" className="flex items-center justify-center gap-2 bg-charcoal text-background px-8 py-4 rounded-full text-lg font-medium hover:bg-primary transition-all shadow-premium hover:shadow-float w-full sm:w-auto">
            Start Swapping
            <ArrowRight size={20} />
          </Link>
          <Link to="/explore" className="flex items-center justify-center gap-2 bg-background border border-surface-hover text-charcoal px-8 py-4 rounded-full text-lg font-medium hover:bg-surface transition-colors w-full sm:w-auto shadow-sm">
            Explore Skills
          </Link>
        </motion.div>
        
        {/* Abstract Hero Graphic */}
        <motion.div 
          style={{ y: y1, opacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] opacity-40 pointer-events-none"
        >
          <div className="absolute top-0 right-10 w-96 h-96 bg-highlight/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"></div>
        </motion.div>
      </section>

      {/* 2. AI MATCH PREVIEW */}
      <section className="relative w-full max-w-5xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="matte-glass rounded-[2.5rem] p-4 md:p-10 shadow-float border border-white/40 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent z-0 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm tracking-wider uppercase">
                <Brain size={18} /> Neural Matching Engine
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-charcoal">Precision pairing for optimal growth.</h2>
              <p className="text-charcoal/70 text-lg">Our AI analyzes your proficiency, learning style, and availability to find the perfect mutual swap.</p>
              
              <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl">
                  <CheckCircle2 className="text-primary" size={20} />
                  <span className="font-medium text-charcoal">94% Compatibility Score</span>
                </div>
                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl">
                  <CheckCircle2 className="text-primary" size={20} />
                  <span className="font-medium text-charcoal">Aligned Timezones (EST/CST)</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-96 bg-background rounded-3xl p-6 shadow-premium border border-surface">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 rounded-full bg-surface-hover overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=47" alt="Avatar" />
                 </div>
                 <div className="bg-highlight/20 text-highlight px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                   98% Match
                 </div>
              </div>
              <h4 className="font-semibold text-lg text-charcoal mb-1">Sarah Jenkins</h4>
              <p className="text-sm text-charcoal/60 mb-6">Senior Frontend Engineer</p>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-charcoal/50 uppercase tracking-wider font-semibold">She teaches</span>
                  <div className="mt-1 flex gap-2"><span className="px-3 py-1 bg-surface text-charcoal text-sm rounded-full">React</span></div>
                </div>
                <div>
                  <span className="text-xs text-charcoal/50 uppercase tracking-wider font-semibold">She wants</span>
                  <div className="mt-1 flex gap-2"><span className="px-3 py-1 bg-primary text-background text-sm rounded-full">Python</span></div>
                </div>
              </div>
              
              <button className="w-full mt-8 bg-charcoal text-background py-3 rounded-xl font-medium hover:bg-primary transition-colors">
                Request Swap
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-charcoal mb-4">How it works</h2>
          <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">Four simple steps to accelerate your career through collaborative learning.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-surface-hover -z-10"></div>
          
          {[
            { step: '01', title: 'Create Profile', desc: 'List what you know and what you want to learn.' },
            { step: '02', title: 'AI Matching', desc: 'Our engine finds your perfect skill-swap partner.' },
            { step: '03', title: 'Connect & Plan', desc: 'Use our AI to generate a custom syllabus and schedule.' },
            { step: '04', title: 'Level Up', desc: 'Swap skills, gain XP, and earn verified badges.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-background border-4 border-surface flex items-center justify-center text-2xl font-serif text-primary mb-6 shadow-sm">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">{item.title}</h3>
              <p className="text-charcoal/60">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. TRENDING SKILLS (Asymmetrical Grid) */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-semibold text-charcoal mb-4">Trending Skills</h2>
            <p className="text-lg text-charcoal/60">What the community is trading right now.</p>
          </div>
          <Link to="/explore" className="hidden md:flex items-center gap-2 font-medium text-primary hover:text-charcoal transition-colors">
            View all <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-charcoal text-background rounded-3xl p-8 md:col-span-2 flex flex-col justify-between min-h-[300px] group relative overflow-hidden">
            <div className="relative z-10">
              <Code size={32} className="text-accent mb-4" />
              <h3 className="text-3xl font-semibold mb-2">Full-Stack Development</h3>
              <p className="text-background/70 max-w-sm">High demand for React, Node.js, and Next.js experts.</p>
            </div>
            <div className="relative z-10 mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-surface border-2 border-charcoal"></div>)}
              </div>
              <span className="text-sm font-medium text-background/80">420+ active swaps</span>
            </div>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full group-hover:bg-accent/30 transition-all duration-700"></div>
          </div>

          <div className="matte-surface rounded-3xl p-8 flex flex-col justify-between min-h-[300px]">
            <div>
              <PenTool size={32} className="text-primary mb-4" />
              <h3 className="text-2xl font-semibold text-charcoal mb-2">UI/UX Design</h3>
              <p className="text-charcoal/60">Figma, Prototyping, Design Systems.</p>
            </div>
            <div className="mt-10 font-medium text-primary flex items-center gap-2">
              <TrendingUp size={18} /> Rising Demand
            </div>
          </div>

          <div className="matte-surface rounded-3xl p-8 flex flex-col justify-between min-h-[300px]">
            <div>
              <Database size={32} className="text-highlight mb-4" />
              <h3 className="text-2xl font-semibold text-charcoal mb-2">Data Science</h3>
              <p className="text-charcoal/60">Python, Machine Learning, SQL.</p>
            </div>
            <div className="mt-10 font-medium text-highlight flex items-center gap-2">
              <Zap size={18} /> High ROI
            </div>
          </div>

          <div className="bg-primary text-background rounded-3xl p-8 md:col-span-2 flex flex-col justify-between min-h-[300px] relative overflow-hidden">
            <div className="relative z-10">
              <Layout size={32} className="text-highlight mb-4" />
              <h3 className="text-3xl font-semibold mb-2">Product Management</h3>
              <p className="text-background/70 max-w-sm">Agile, Roadmapping, User Research.</p>
            </div>
            <div className="relative z-10 mt-10">
              <Link to="/signup" className="inline-flex items-center gap-2 bg-background text-primary px-6 py-3 rounded-full font-medium hover:bg-surface transition-colors shadow-sm">
                Start Trading <ArrowRight size={18} />
              </Link>
            </div>
            <div className="absolute -right-10 -top-10 w-64 h-64 border-[40px] border-white/5 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* 5. COMMUNITY STATS */}
      <section className="bg-charcoal py-24 my-10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 divide-x divide-white/10">
            {[
              { value: '12k+', label: 'Active Users' },
              { value: '45k', label: 'Hours Swapped' },
              { value: '98%', label: 'Match Success' },
              { value: '50+', label: 'Countries' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4">
                <span className="text-4xl md:text-5xl font-semibold text-background mb-2">{stat.value}</span>
                <span className="text-background/60 font-medium tracking-wide uppercase text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <h2 className="text-4xl font-semibold text-charcoal mb-12 text-center">Loved by learners</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "David K.", role: "Backend Developer", text: "I taught Python in exchange for React lessons. The AI matched me with someone who had my exact learning style. Incredible." },
            { name: "Elena R.", role: "UX Designer", text: "SkillSphere's AI roadmap kept us on track. Instead of just casual chatting, we actually built a product together while swapping skills." },
            { name: "James L.", role: "Product Manager", text: "The UI feels like a premium workspace. It doesn't feel like a sketchy forum; it feels like a professional accelerator." }
          ].map((item, i) => (
            <div key={i} className="matte-surface p-8 rounded-3xl">
              <div className="flex text-highlight mb-6">
                {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
              </div>
              <p className="text-charcoal/80 text-lg mb-8">"{item.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-hover"></div>
                <div>
                  <h4 className="font-semibold text-charcoal text-sm">{item.name}</h4>
                  <p className="text-xs text-charcoal/50">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="max-w-3xl mx-auto px-6 w-full pt-10">
        <h2 className="text-4xl font-semibold text-charcoal mb-10 text-center">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: "Is it really free?", a: "Yes, the core skill-swapping functionality is completely free. You pay with your time and knowledge." },
            { q: "How does the AI matching work?", a: "Our Gemini-powered engine analyzes your skills, goals, availability, and learning preferences to find statistically optimal partners." },
            { q: "What if my match bails?", a: "We track reliability scores. Users who consistently miss sessions lose reputation and access to premium matches." }
          ].map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>

      {/* 8. CTA & FOOTER */}
      <footer className="mt-20 pt-20 border-t border-surface">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center mb-32">
          <h2 className="text-5xl font-semibold text-charcoal mb-6">Ready to join the network?</h2>
          <p className="text-xl text-charcoal/60 mb-10 max-w-2xl">Create your profile today and let our AI find your first skill swap partner.</p>
          <Link to="/signup" className="bg-primary text-background px-10 py-5 rounded-full text-lg font-medium hover:bg-primary/90 transition-all shadow-premium">
            Join the Community
          </Link>
        </div>
        
        <div className="border-t border-surface py-10 flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-medium text-lg text-charcoal mb-4 md:mb-0">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-background">
              <Zap size={12} />
            </div>
            SkillSphere AI
          </div>
          <div className="flex gap-6 text-sm text-charcoal/60">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-surface rounded-2xl bg-background overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
      >
        <span className="font-medium text-charcoal text-lg">{question}</span>
        <ChevronDown className={`text-charcoal/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden bg-surface/30"
      >
        <p className="px-6 pb-5 pt-2 text-charcoal/70">{answer}</p>
      </motion.div>
    </div>
  );
}
