import { 
  Store, 
  Search, 
  ShoppingCart, 
  Plus, 
  MapPin, 
  Leaf, 
  ArrowRight,
  Truck,
  XCircle,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { useData } from '../lib/DataContext';

export default function MarketPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, categories: dataCategories } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Produce');
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = ['All Produce', ...dataCategories.map(c => c.name)];

  const handleAddToCart = (p: any) => {
    addToCart(p);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Produce' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-surface min-h-screen">
      {/* Editorial Hero */}
      <section className="px-3 md:px-6 max-w-7xl mx-auto mb-6 md:mb-16 pt-2 md:pt-8">
        <div className="relative rounded-2xl md:rounded-[3rem] bg-surface-container-low p-4 md:p-20 flex flex-col md:flex-row items-center gap-4 md:gap-12 overflow-hidden shadow-sm">
          <div className="flex-1 z-10 text-center md:text-left">
            <h1 className="text-xl md:text-6xl font-serif font-black mb-2 md:mb-6 leading-tight italic">Mountain Fresh, <br/>City Bound.</h1>
            <p className="text-[10px] md:text-xl opacity-80 mb-4 md:mb-12 max-w-lg mx-auto md:mx-0">Support Northern Thailand's farmers.</p>
            <button 
              onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
              className="px-4 md:px-10 py-2 md:py-5 rounded-lg md:rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-[10px] md:text-xl shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
            >
              Browse Collection
            </button>
          </div>
          <div className="flex-1 relative w-full aspect-[21/9] md:aspect-square">
            <motion.div 
              initial={{ rotate: 10, scale: 0.9 }}
              animate={{ rotate: 3, scale: 1 }}
              className="w-full h-full relative"
            >
              <img 
                alt="Fresh basket" 
                className="w-full h-full object-cover rounded-xl md:rounded-[3rem] shadow-2xl relative z-10" 
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=1000"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search & Tabs */}
      <section className="px-3 md:px-6 max-w-7xl mx-auto mb-6 sticky top-16 md:top-20 z-40">
        <div className="bg-surface-bright/80 backdrop-blur-xl p-1.5 md:p-4 rounded-xl md:rounded-3xl flex flex-col md:flex-row gap-2 md:gap-4 items-center shadow-lg border border-outline-variant/15">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-3.5 h-3.5 md:w-5 md:h-5" />
            <input 
              className="w-full pl-8 md:pl-12 pr-10 py-2 md:py-4 rounded-lg md:rounded-2xl bg-surface-container-low border-none focus:ring-1 md:ring-2 focus:ring-primary transition-all text-[10px] md:text-base placeholder:text-on-surface-variant/50" 
              placeholder="Search harvest..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar w-full py-0.5">
            {categories.map((cat, i) => (
              <button 
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 md:px-6 py-1 md:py-2.5 rounded-full text-[10px] md:text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-3 md:px-6 max-w-7xl mx-auto pb-24">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((p) => (
                <motion.article 
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-surface-container-lowest rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="aspect-[3/2] md:aspect-[4/3] bg-surface-variant overflow-hidden relative">
                    <img 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      src={p.image}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-2 md:p-8">
                    <div className="flex justify-between items-center mb-1 md:mb-3">
                      <h3 className="text-[11px] md:text-2xl font-bold font-serif text-on-surface group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                      <p className="font-bold text-[11px] md:text-2xl text-primary md:ml-0 ml-1">฿{p.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between mb-2 md:mb-8 overflow-hidden">
                      <div className="flex items-center gap-1 md:gap-3">
                        <span className="flex text-[7px] text-on-surface-variant">/ {p.unit}</span>
                      </div>
                    </div>
                    <p className="hidden md:block text-sm md:text-base text-on-surface-variant mb-8 leading-relaxed italic">{p.description}</p>
                    <button 
                      onClick={() => handleAddToCart(p)}
                      disabled={addedId === p.id}
                      className={`w-full py-1.5 md:py-4 rounded-lg md:rounded-2xl font-bold text-[10px] md:text-base flex items-center justify-center gap-1.5 md:gap-3 transition-all active:scale-95 group/btn shadow-sm ${
                        addedId === p.id 
                        ? 'bg-secondary text-on-secondary cursor-default' 
                        : 'bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary'
                      }`}
                    >
                      {addedId === p.id ? (
                        <>
                          <Check className="w-3 h-3 md:w-5 md:h-5 animate-in zoom-in" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="group-hover/btn:scale-110 transition-transform w-3 h-3 md:w-5 md:h-5" />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-6">
              <Leaf size={48} className="opacity-20" />
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-2 font-serif">Harvest Not Found</h3>
            <p className="text-on-surface-variant max-w-xs">We couldn't find any products matching your search or category selection.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All Produce'); }}
              className="mt-8 text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>


    </div>
  );
}
