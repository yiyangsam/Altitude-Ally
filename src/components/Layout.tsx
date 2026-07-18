import {
  ShoppingCart,
  X,
  Instagram,
  Mail,
  MessageCircle,
  Facebook
} from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useCart } from '../lib/CartContext';
import { useData } from '../lib/DataContext';

type FooterPanel = 'mission' | 'contact' | 'privacy' | 'terms';

const defaultFooterPageConfig = {
  mission_text: 'Our mission content will be added here.',
  privacy_text: 'Our privacy policy will be added here.',
  terms_text: 'Our terms and conditions will be added here.',
  instagram: 'Instagram details coming soon.',
  email: 'Email details coming soon.',
  line: 'LINE details coming soon.',
  facebook: 'Facebook details coming soon.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const { totalItems } = useCart();
  const { footerPageConfig } = useData();
  const navigate = useNavigate();
  const [activeFooterPanel, setActiveFooterPanel] = useState<FooterPanel | null>(null);
  const footerConfig = footerPageConfig || defaultFooterPageConfig;

  useEffect(() => {
    if (!activeFooterPanel) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveFooterPanel(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeFooterPanel]);

  const panelTitle = activeFooterPanel === 'mission'
    ? 'Our Mission'
    : activeFooterPanel === 'contact'
      ? 'Contact Us'
      : activeFooterPanel === 'privacy'
        ? 'Privacy'
        : 'Terms';

  const panelText = activeFooterPanel === 'mission'
    ? footerConfig.mission_text
    : activeFooterPanel === 'privacy'
      ? footerConfig.privacy_text
      : footerConfig.terms_text;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/15 px-2 sm:px-4 md:px-6">
        <nav className="flex items-center h-24 md:h-32 max-w-7xl mx-auto w-full gap-2 md:gap-4">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img src="/logo.png" className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 group-hover:scale-110 transition-transform" alt="Altitude Ally Logo" />
            <span className="font-serif italic font-bold text-primary text-sm md:text-xl tracking-tight hidden sm:inline">Altitude Ally</span>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-8 flex-1 justify-center md:justify-end overflow-x-auto no-scrollbar py-2">
            <NavLink to="/" aria-label="Store" className={({ isActive }) => `flex min-h-11 items-center px-0.5 font-serif text-sm font-bold md:px-0 md:text-lg transition-all whitespace-nowrap ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              <span>Store</span>
            </NavLink>
            <NavLink to="/impact" aria-label="Impact" className={({ isActive }) => `flex min-h-11 items-center px-0.5 font-serif text-sm font-bold md:px-0 md:text-lg transition-all whitespace-nowrap ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              <span>Impact</span>
            </NavLink>
            <NavLink to="/donation" aria-label="Donate" className={({ isActive }) => `flex min-h-11 items-center px-0.5 font-serif text-sm font-bold md:px-0 md:text-lg transition-all whitespace-nowrap ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              <span>Donate</span>
            </NavLink>
            <NavLink to="/account" aria-label={isLoggedIn ? 'Account' : 'Login'} className={({ isActive }) => `flex min-h-11 items-center px-0.5 font-serif text-sm font-bold md:px-0 md:text-lg transition-all whitespace-nowrap ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              <span>{isLoggedIn ? 'Account' : 'Login'}</span>
            </NavLink>
          </div>
 
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <button 
              onClick={() => navigate('/checkout')}
              className="text-primary p-1.5 md:p-2 hover:bg-primary-fixed/20 rounded-full transition-all relative group"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    key={totalItems}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-error text-white text-[8px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>
 
      <main className="flex-1 pt-24 md:pt-32">
        {children}
      </main>

      {/* Footer for Desktop */}
      <footer className="bg-surface-container-high py-10 md:py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="md:col-span-3">
            <span className="font-serif text-2xl text-primary font-bold italic mb-4 block">Altitude Ally</span>
            <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-on-surface-variant">
              <li><button type="button" onClick={() => setActiveFooterPanel('mission')} className="hover:text-primary underline-offset-4 hover:underline">Our Mission</button></li>
              <li><button type="button" onClick={() => setActiveFooterPanel('contact')} className="hover:text-primary underline-offset-4 hover:underline">Contact Us</button></li>
              <li><button type="button" onClick={() => setActiveFooterPanel('privacy')} className="hover:text-primary underline-offset-4 hover:underline">Privacy</button></li>
              <li><button type="button" onClick={() => setActiveFooterPanel('terms')} className="hover:text-primary underline-offset-4 hover:underline">Terms</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Systems</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link to="/operator/login" className="hover:text-primary underline-offset-4 hover:underline">Operator Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-12 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
          <p>&copy; 2024 Altitude Ally.</p>
          <img src="/logo.png" className="w-12 h-12 md:w-16 md:h-16 object-contain opacity-70" alt="Altitude Ally Logo" />
        </div>
      </footer>

      <AnimatePresence>
        {activeFooterPanel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.button
              type="button"
              aria-label="Close footer information"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFooterPanel(null)}
              className="absolute inset-0 h-full w-full bg-on-surface/45 backdrop-blur-sm"
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="footer-panel-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="relative w-full max-w-xl max-h-[82vh] overflow-y-auto rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline-variant/20"
            >
              <header className="sticky top-0 flex items-center justify-between gap-4 border-b border-outline-variant/20 bg-surface-container-lowest px-6 py-5 md:px-8">
                <h2 id="footer-panel-title" className="text-2xl md:text-3xl font-bold font-serif text-on-surface">{panelTitle}</h2>
                <button
                  type="button"
                  onClick={() => setActiveFooterPanel(null)}
                  aria-label="Close"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                >
                  <X size={20} />
                </button>
              </header>

              <div className="px-6 py-6 md:px-8 md:py-8">
                {activeFooterPanel === 'contact' ? (
                  <div className="grid gap-3">
                    {[
                      { label: 'Instagram', value: footerConfig.instagram, icon: Instagram },
                      { label: 'Email', value: footerConfig.email, icon: Mail },
                      { label: 'LINE', value: footerConfig.line, icon: MessageCircle },
                      { label: 'Facebook', value: footerConfig.facebook, icon: Facebook }
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-start gap-4 border-b border-outline-variant/15 py-4 last:border-0">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon size={19} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase text-on-surface-variant">{label}</p>
                          <p className="mt-1 break-words text-base text-on-surface">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-base leading-7 text-on-surface-variant">{panelText}</p>
                )}
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
