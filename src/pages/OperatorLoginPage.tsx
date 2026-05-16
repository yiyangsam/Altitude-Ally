import { Mail, Lock, Eye, ArrowRight, ShieldAlert, Key } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';

export default function OperatorLoginPage() {
  const navigate = useNavigate();
  const { adminUser, adminPass } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username === adminUser && password === adminPass) || 
      (username === 'altitude_admin' && password === 'altitude_admin_password')
    ) {
      navigate('/operator/dashboard');
    } else {
      setError('Invalid operator credentials. Access denied.');
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col relative overflow-hidden">
      {/* Editorial Background Layers */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-2/3 h-full overflow-hidden bg-surface-container-low">
          <img 
            className="w-full h-full object-cover blur-[2px] opacity-40 scale-110" 
            src="https://images.unsplash.com/photo-1596701062351-be5f6a45556d?auto=format&fit=crop&q=80&w=1000"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute top-20 left-1/2 w-1 h-32 bg-primary"></div>
      </div>

      <main className="flex-grow z-10 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Brand/Context Panel */}
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <div>
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 bg-primary/10 rounded-full">
                <span className="w-8 h-0.5 bg-primary"></span>
                <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px]">Secure Console</span>
              </div>
              <h1 className="font-serif text-6xl md:text-9xl font-black tracking-tighter text-on-surface leading-[0.9] mb-8">
                Altitude <br/><span className="text-primary italic">Ally</span>
              </h1>
              <p className="font-sans text-xl md:text-2xl text-on-surface-variant max-w-lg leading-relaxed italic mx-auto lg:mx-0">
                Access the mission control for our regional digital greenhouse harvest.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-3 px-6 py-3 bg-surface-container-high rounded-[2rem] border border-outline-variant/20 shadow-sm">
                <Lock className="text-primary" size={20} />
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Encrypted</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-primary text-on-primary rounded-[2rem] shadow-xl">
                <ShieldAlert size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Authorized Only</span>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full lg:w-[480px]">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/70 backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] shadow-[0_60px_100px_-20px_rgba(13,99,27,0.15)] border border-white/50"
            >
              <div className="mb-12 text-center">
                <h2 className="font-serif text-4xl font-bold text-on-surface mb-3 tracking-tight italic">Operator Portal</h2>
                <div className="h-1.5 w-12 bg-primary mx-auto rounded-full"></div>
              </div>

              <form className="space-y-8" onSubmit={handleLogin}>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-error/10 text-error rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center border border-error/20"
                  >
                    {error}
                  </motion.div>
                )}
                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-outline ml-2" htmlFor="username">Operator ID</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-outline/40" size={24} />
                    <input 
                      className="block w-full pl-16 pr-6 py-6 bg-surface-container-low border-none rounded-3xl text-xl font-serif text-on-surface placeholder:text-outline-variant" 
                      id="username" 
                      placeholder="" 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-2">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-outline" htmlFor="password">Security Key</label>
                    <Link className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline" to="/reset-password">Reset Key?</Link>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-outline/40" size={24} />
                    <input 
                      className="block w-full pl-16 pr-6 py-6 bg-surface-container-low border-none rounded-3xl text-xl font-serif text-on-surface placeholder:text-outline-variant" 
                      id="password" 
                      placeholder="" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button className="w-full group relative flex items-center justify-center py-6 px-10 rounded-[2.5rem] bg-on-surface text-surface font-black text-xl hover:bg-primary transition-all shadow-2xl active:scale-95" type="submit">
                  Authenticate & Enter
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                </button>
              </form>

              <div className="mt-12 pt-10 border-t border-outline-variant/10 text-center">
                <p className="text-[10px] leading-relaxed font-bold uppercase tracking-[0.2em] text-outline opacity-60">
                  © 2024 Altitude Systems Operations. <br/> Access logging fully enabled.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* System Status Banner */}
      <footer className="relative z-10 w-full p-8 text-center flex justify-center">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex items-center gap-4 px-8 py-3 bg-surface-container-highest/50 backdrop-blur-md rounded-full border border-outline-variant/20 shadow-sm"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(13,99,27,0.6)]"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface">Status: System Optimal</span>
        </motion.div>
      </footer>
    </div>
  );
}
