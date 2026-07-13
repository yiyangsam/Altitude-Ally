import { 
  BarChart, 
  Wallet, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Eye,
  Mountain,
  MapPin,
  Leaf,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useData, ImpactProject } from '../lib/DataContext';

export default function ImpactPage() {
  const { impactProjects, impactPageConfig } = useData();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ImpactProject | null>(null);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProject]);

  const filteredProjects = impactProjects.filter(p => {
    const matchesFilter = filter === 'All' || p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { label: 'All Projects', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Done' },
    { label: 'Upcoming', value: 'Wait' }
  ];

  return (
    <div className="bg-surface min-h-screen">
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-12 pb-20 md:pb-32">
        {/* Impact Hero */}
        <section className="relative mb-8 md:mb-20 overflow-hidden rounded-2xl md:rounded-[3rem] bg-primary-container text-on-primary-container p-6 md:p-20 shadow-xl">
          <div className="relative z-10 max-w-3xl text-center md:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-7xl font-bold mb-4 md:mb-8 leading-tight font-serif italic"
            >
              {impactPageConfig?.hero_title || "$5,000 Raised for School Gardens"}
            </motion.h1>
            <p className="text-sm md:text-2xl opacity-90 mb-8 md:mb-12 font-sans font-light leading-relaxed max-w-2xl">
              {impactPageConfig?.hero_description || "Together, we've cultivated more than just produce. We've planted the seeds of nutrition and community for 800+ families."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button 
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                className="bg-surface-container-lowest text-primary px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-sm md:text-xl hover:scale-95 shadow-xl transition-all"
              >
                View Annual Report
              </button>
              <button 
                onClick={() => document.getElementById('transparent-growth')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-sm md:text-xl hover:bg-white/20 transition-all"
              >
                Our Mission
              </button>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 opacity-10">
            <Mountain size={500} />
          </div>
          <div className="absolute top-0 right-0 h-full w-1/3 opacity-30 pointer-events-none hidden lg:block">
            <img 
              alt="Community garden" 
              className="h-full w-full object-cover" 
              src="https://images.unsplash.com/photo-1596701062351-be5f6a45556d?auto=format&fit=crop&q=80&w=1000"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* Transparency Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:grid-cols-3 md:gap-8 mb-12 md:mb-20">
          <div className="md:col-span-2 bg-surface-container-low rounded-2xl md:rounded-[3rem] p-5 md:p-12 border border-outline-variant/20 shadow-sm relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-16 gap-4">
                <div className="max-w-md">
                  <h2 className="text-2xl md:text-4xl font-bold text-on-surface mb-2 md:mb-4 font-serif">Fund Transparency</h2>
                  <p className="text-on-surface-variant text-sm md:text-lg leading-relaxed italic">Real-time tracking of every dollar.</p>
                </div>
                <div className="bg-primary/10 p-3 md:p-5 rounded-2xl md:rounded-3xl text-primary">
                  <Wallet className="w-6 h-6 md:w-10 md:h-10" />
                </div>
              </div>
              
              <div className="space-y-6 md:space-y-10">
                {(impactPageConfig?.transparency_stats || [
                  { label: 'Garden Infrastructure', value: 65, color: 'bg-primary' },
                  { label: 'Seed Distribution', value: 25, color: 'bg-primary-fixed-dim' },
                  { label: 'Community Workshops', value: 10, color: 'bg-tertiary-fixed-dim' }
                ]).map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2 md:mb-4 text-[10px] md:text-sm font-bold uppercase tracking-widest text-secondary">
                      <span>{stat.label}</span>
                      <span>{stat.value}%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 md:h-4 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stat.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`${stat.color} h-full rounded-full shadow-lg`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl md:rounded-[3rem] p-6 md:p-12 border border-outline-variant/20 flex flex-col items-center text-center justify-center relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary-fixed rounded-xl md:rounded-[2rem] flex items-center justify-center mb-4 md:mb-8 rotate-3 shadow-xl text-primary">
              <Users className="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <div className="text-4xl md:text-7xl font-bold text-primary mb-2 md:mb-4 font-serif italic tracking-tighter">{impactPageConfig?.families_served || "800+"}</div>
            <div className="text-lg md:text-2xl font-bold text-secondary mb-3 md:mb-6 font-serif">Families Served</div>
            <p className="text-on-surface-variant text-[11px] md:text-base leading-relaxed italic">Providing nutrition to mountain ridges.</p>
          </div>
        </div>

        {/* Recent Projects Grid */}
        <section className="mb-16 md:mb-24 px-1 md:px-2">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-12 gap-4 md:gap-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-on-surface mb-2 md:mb-3 font-serif underline decoration-primary-fixed underline-offset-8">Recent Projects</h2>
              <p className="text-on-surface-variant text-sm md:text-lg">Where your contributions grow.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto mt-4 md:mt-0">
              {/* Search Bar */}
              <div className="relative w-full md:w-64 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors h-5 w-5" />
                <input 
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2 justify-center">
                {filterOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm ${
                      filter === opt.value 
                      ? 'bg-primary text-on-primary scale-105' 
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest hover:scale-105'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((p, i) => (
                <motion.div 
                  key={p.id || i}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedProject(p)}
                  className="bg-surface-container-lowest rounded-2xl md:rounded-3xl overflow-hidden group border border-outline-variant/10 shadow-sm transition-shadow hover:shadow-lg cursor-pointer"
                >
                  <div className="h-32 md:h-56 overflow-hidden">
                    <img alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={p.image} referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-3 md:p-8">
                    <span className="inline-block px-2 md:px-4 py-0.5 md:py-1.5 bg-secondary-container text-on-secondary-container text-xs md:text-[10px] scale-[0.7] md:scale-100 origin-left font-bold uppercase tracking-widest rounded-full mb-2 md:mb-6 shadow-sm">{p.tag}</span>
                    <h3 className="text-xs md:text-2xl font-bold mb-1 md:mb-3 font-serif italic text-on-surface line-clamp-1">{p.title}</h3>
                    <div className="flex justify-between items-center pt-2 md:pt-6 border-t border-outline-variant/10 mt-2 md:mt-4">
                      <span className="text-primary font-bold text-xs md:text-xl">{p.amount}</span>
                      <span className="text-[8px] md:text-xs text-secondary font-extrabold uppercase tracking-widest">{p.status === 'Wait' ? 'Upcoming' : p.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30">
                <Leaf className="w-12 h-12 text-outline/30 mx-auto mb-4" />
                <p className="text-on-surface-variant italic text-lg">No projects match your search criteria.</p>
                <button 
                  onClick={() => { setFilter('All'); setSearchQuery(''); }}
                  className="mt-4 text-primary font-bold hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Transparent Growth Panel */}
        <section id="transparent-growth" className="bg-surface-container-high rounded-2xl md:rounded-[4rem] p-6 md:p-24 flex flex-col lg:flex-row items-center gap-10 md:gap-16 shadow-inner">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-2xl md:text-5xl font-bold text-on-surface mb-4 md:mb-8 font-serif italic leading-tight">Transparent Growth</h2>
            <p className="text-on-surface-variant text-sm md:text-xl mb-8 md:mb-12 font-sans font-light leading-relaxed">
              We believe trust is grown, not given. Every transaction contributes directly to the transparency dashboard.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
              <div className="flex items-center gap-4">
                <div className="bg-primary-container/10 p-3 rounded-2xl text-primary">
                  <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-secondary leading-tight">Verified <br className="hidden md:block"/>Spending</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary-container/10 p-3 rounded-2xl text-primary">
                  <Eye className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-secondary leading-tight">Public <br className="hidden md:block"/>Ledgers</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4 items-end">
            <motion.div 
              initial={{ rotate: -5 }}
              whileInView={{ rotate: 3 }}
              className="aspect-square rounded-2xl md:rounded-[3rem] overflow-hidden bg-surface shadow-xl"
            >
              <img 
                alt="Farmer checking crop" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1596701062351-be5f6a45556d?auto=format&fit=crop&q=80&w=1000"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div 
              initial={{ rotate: 5 }}
              whileInView={{ rotate: -2 }}
              className="aspect-square rounded-2xl md:rounded-[3rem] overflow-hidden translate-y-6 md:translate-y-12 bg-surface shadow-xl"
            >
              <img 
                alt="Fresh vegetables" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&q=80&w=1000"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </section>
      </main>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedProject(null)} 
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative w-full max-w-3xl bg-surface rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="relative h-64 md:h-96 w-full">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                <button 
                  onClick={() => setSelectedProject(null)} 
                  className="absolute top-6 right-6 p-3 bg-surface/20 hover:bg-surface/40 backdrop-blur-md rounded-full text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                  <span className="inline-block px-3 py-1 bg-secondary text-on-secondary text-xs font-bold uppercase tracking-widest rounded-full mb-3 shadow-md">
                    {selectedProject.tag}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-on-surface leading-tight drop-shadow-md">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>
              
              <div className="p-6 md:p-10 bg-surface">
                <div className="flex flex-col md:flex-row gap-8 justify-between">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4 p-5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                      <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Wallet size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Funded Amount</p>
                        <p className="text-2xl font-black text-primary font-serif">{selectedProject.amount}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-64 space-y-4">
                    <div className="p-5 bg-tertiary-container text-on-tertiary-container rounded-2xl flex items-center gap-4">
                      <Clock className="w-8 h-8 opacity-70" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Current Status</p>
                        <p className="font-bold text-lg">{selectedProject.status === 'Wait' ? 'Upcoming' : selectedProject.status}</p>
                      </div>
                    </div>
                    
                    <button onClick={() => setSelectedProject(null)} className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-lg hover:scale-[0.98] transition-all">
                      Close Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
