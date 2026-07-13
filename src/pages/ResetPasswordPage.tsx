import { Mail, ShieldCheck, ArrowLeft, Send, Key } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function ResetPasswordPage() {
  return (
    <div className="bg-surface min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-xl space-y-12 relative z-10">
        <Link to="/operator/login" className="inline-flex items-center gap-2 text-primary font-bold hover:opacity-70 transition-opacity group">
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          Back to Login
        </Link>

        {/* Hero Visual */}
        <div className="relative mx-auto w-56 h-56 md:w-72 md:h-72">
          <motion.div 
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative overflow-hidden rounded-[3rem] bg-surface-container-low p-4 shadow-2xl border border-outline-variant/20 h-full w-full"
          >
            <img 
              alt="Altitude Ally Heritage" 
              className="w-full h-full object-cover rounded-[2rem]" 
              src="https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&q=80&w=1000"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute -bottom-6 -right-6 bg-primary text-on-primary p-6 rounded-[2rem] shadow-[0_20px_40px_-12px_rgba(13,99,27,0.3)] rotate-12 scale-110">
            <Key size={40} />
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center space-y-6">
          <h1 className="font-serif text-5xl md:text-7xl text-on-surface tracking-tight font-black leading-tight italic">
            Forgot <br/>Password?
          </h1>
          <p className="text-on-surface-variant text-xl leading-relaxed max-w-md mx-auto font-sans">
            Enter your email address and we'll send you instructions to reset your password and reclaim your account.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <label className="text-secondary font-black text-xs uppercase tracking-[0.2em] px-2 block" htmlFor="email">Email Address</label>
            <div className="relative group">
              <input 
                className="w-full px-8 py-6 rounded-3xl bg-surface-container-high border-2 border-transparent focus:border-primary focus:ring-0 transition-all text-on-surface text-xl placeholder:text-outline/30 font-serif" 
                id="email" 
                placeholder="farmer@altitudeally.org" 
                type="email" 
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-outline/30 group-focus-within:text-primary transition-colors">
                <Mail size={28} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 items-center pt-4">
            <button className="w-full py-6 px-10 rounded-3xl bg-gradient-to-r from-primary to-primary-container text-white font-black text-2xl shadow-[0_24px_48px_-12px_rgba(13,99,27,0.25)] hover:shadow-[0_24px_48px_-12px_rgba(13,99,27,0.35)] active:scale-95 duration-200 flex items-center justify-center gap-4 transition-all" type="submit">
              Send Reset Link
              <Send size={24} />
            </button>
          </div>
        </form>

        {/* Trust Note */}
        <div className="pt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-secondary-container/30 text-on-secondary-container text-xs font-black tracking-[0.2em] uppercase shadow-sm">
            <ShieldCheck size={18} />
            Secured by Altitude Ally
          </div>
        </div>
      </div>
    </div>
  );
}
