import { 
  Store, 
  Leaf, 
  Calendar, 
  User, 
  Settings, 
  ShoppingCart, 
  Menu,
  LogIn
} from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { useCart } from '../lib/CartContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/15 px-4 md:px-6">
        <nav className="flex items-center h-24 md:h-32 max-w-7xl mx-auto w-full gap-4">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img src="/logo.png" className="w-20 h-20 md:w-28 md:h-28 group-hover:scale-110 transition-transform" alt="Altitude Ally Logo" />
            <span className="font-serif italic font-bold text-primary text-sm md:text-xl tracking-tight hidden sm:inline">Altitude Ally</span>
          </Link>
          
          <div className="flex items-center gap-4 md:gap-8 flex-1 justify-center md:justify-end overflow-x-auto no-scrollbar py-2">
            <NavLink to="/" className={({ isActive }) => `flex items-center gap-1 font-serif text-xs md:text-lg transition-all whitespace-nowrap ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              <Store className="w-3.5 h-3.5 md:hidden" />
              Store
            </NavLink>
            <NavLink to="/impact" className={({ isActive }) => `flex items-center gap-1 font-serif text-xs md:text-lg transition-all whitespace-nowrap ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              <Leaf className="w-3.5 h-3.5 md:hidden" />
              Impact
            </NavLink>
            <NavLink to="/account" className={({ isActive }) => `flex items-center gap-1 font-serif text-xs md:text-lg transition-all whitespace-nowrap ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              {isLoggedIn ? <User className="w-3.5 h-3.5 md:hidden" /> : <LogIn className="w-3.5 h-3.5 md:hidden" />}
              {isLoggedIn ? 'Account' : 'Login'}
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
              <li><Link to="/mission" className="hover:text-primary underline-offset-4 hover:underline">Our Mission</Link></li>
              <li><Link to="/contact" className="hover:text-primary underline-offset-4 hover:underline">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-primary underline-offset-4 hover:underline">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-primary underline-offset-4 hover:underline">Terms</Link></li>
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
    </div>
  );
}
