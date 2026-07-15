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
  Check,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { useData } from '../lib/DataContext';

export default function MarketPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, categories: dataCategories, marketPageConfig } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Produce');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedVariation, setSelectedVariation] = useState('');
  const [selectedPortion, setSelectedPortion] = useState('');

  const heroImageUrl = marketPageConfig?.hero_image_url || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=2000';

  const categories = ['All Produce', ...dataCategories.map(c => c.name)];

  const handleAddToCart = (p: any, options?: { variation?: string; portion?: string }) => {
    const configuredProduct = {
      ...p,
      id: [p.id, options?.variation, options?.portion].filter(Boolean).join('-'),
      productId: p.id,
      selectedVariation: options?.variation,
      selectedPortion: options?.portion
    };
    addToCart(configuredProduct);
    setAddedId(configuredProduct.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (p.details || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Produce' || p.category === activeCategory;
    return p.availability !== 'hidden' && matchesSearch && matchesCategory;
  });

  const openProduct = (p: any) => {
    setSelectedProduct(p);
    setSelectedVariation(p.variations?.[0] || '');
    setSelectedPortion(p.portions?.[0] || '');
  };

  return (
    <div className="bg-surface min-h-screen">
      {/* Full-Width Hero */}
      <section className="relative w-full h-[40vh] md:h-[calc(100vh-5rem)] overflow-hidden mb-6 md:mb-16">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          alt="Hero banner"
          className="absolute inset-0 w-full h-full object-cover"
          src={heroImageUrl}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-16 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-2xl md:text-8xl font-serif font-black mb-2 md:mb-6 leading-tight italic text-white drop-shadow-lg">Altitude Ally</h1>
          </motion.div>
        </div>
      </section>

      {/* Search & Tabs */}
      <section className="px-3 md:px-10 md:max-w-none max-w-7xl mx-auto mb-6 sticky top-16 md:top-20 z-40">
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
      <section className="px-3 md:px-10 md:max-w-none max-w-7xl mx-auto pb-24">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((p) => (
                <motion.article 
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  onClick={() => openProduct(p)}
                  className="group relative bg-surface-container-lowest rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="aspect-[3/2] md:aspect-[4/3] bg-surface-variant overflow-hidden relative">
                    <img 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      src={p.image}
                      referrerPolicy="no-referrer"
                    />
                    {p.availability === 'out_of_stock' && (
                      <span className="absolute left-2 top-2 md:left-4 md:top-4 px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-[9px] md:text-xs font-black uppercase shadow-lg">
                        Out of Stock
                      </span>
                    )}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        openProduct(p);
                      }}
                      disabled={p.availability === 'out_of_stock'}
                      className={`w-full py-1.5 md:py-4 rounded-lg md:rounded-2xl font-bold text-[10px] md:text-base flex items-center justify-center gap-1.5 md:gap-3 transition-all active:scale-95 group/btn shadow-sm ${
                        p.availability === 'out_of_stock'
                        ? 'bg-red-100 text-red-700 cursor-not-allowed'
                        : 'bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary'
                      }`}
                    >
                      {p.availability === 'out_of_stock' ? (
                        <span>Out of Stock</span>
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

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 24 }} className="relative w-full md:w-[min(1180px,calc(100vw-5rem))] max-h-[92vh] md:max-h-[86vh] bg-surface rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20">
              <button onClick={() => setSelectedProduct(null)} className="absolute right-4 top-4 z-10 p-3 rounded-full bg-surface/90 text-on-surface shadow-lg hover:bg-surface-container-high transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 max-h-[92vh] md:max-h-[86vh] overflow-y-auto no-scrollbar">
                <div className="h-72 md:h-full min-h-[520px] bg-surface-variant">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="p-5 md:p-12 flex flex-col">
                  <div className="mb-8">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-primary mb-3">{selectedProduct.category}</p>
                    <h2 className="text-3xl md:text-6xl font-serif font-black italic text-on-surface leading-tight mb-4">{selectedProduct.name}</h2>
                    <p className="text-2xl md:text-4xl font-black text-primary font-serif">฿{selectedProduct.price.toLocaleString()} <span className="text-sm md:text-lg text-on-surface-variant font-sans font-semibold">/ {selectedProduct.unit}</span></p>
                  </div>

                  <div className="space-y-5 text-on-surface-variant leading-relaxed mb-8">
                    <p className="text-sm md:text-lg italic">{selectedProduct.description}</p>
                    {selectedProduct.details && (
                      <p className="text-sm md:text-base">{selectedProduct.details}</p>
                    )}
                  </div>

                  <div className="space-y-6 mb-8">
                    {selectedProduct.variations?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 text-primary">
                          <SlidersHorizontal className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Variation</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.variations.map((variation: string) => (
                            <button key={variation} onClick={() => setSelectedVariation(variation)} className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${selectedVariation === variation ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}>
                              {variation}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.portions?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 text-secondary">
                          <ShoppingCart className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Portion</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.portions.map((portion: string) => (
                            <button key={portion} onClick={() => setSelectedPortion(portion)} className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${selectedPortion === portion ? 'bg-secondary text-white' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}>
                              {portion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(selectedProduct, { variation: selectedVariation, portion: selectedPortion })}
                    disabled={selectedProduct.availability === 'out_of_stock'}
                    className={`mt-auto w-full py-4 md:py-5 rounded-2xl font-black text-base md:text-xl shadow-xl transition-all flex items-center justify-center gap-3 ${selectedProduct.availability === 'out_of_stock' ? 'bg-red-100 text-red-700 cursor-not-allowed' : 'bg-primary text-on-primary hover:scale-[0.99] active:scale-95'}`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {selectedProduct.availability === 'out_of_stock' ? 'Out of Stock' : 'Add Selected Options'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
