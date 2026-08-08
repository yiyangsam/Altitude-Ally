import {
  Check,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Maximize2,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '../lib/CartContext';
import { useData, type Product } from '../lib/DataContext';

const fallbackHeroImage = 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=2000';

export default function MarketPage() {
  const { cart, addToCart, updateQuantity } = useCart();
  const { products, categories: dataCategories, marketPageConfig } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Produce');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariationId, setSelectedVariationId] = useState('');
  const [selectedPortionId, setSelectedPortionId] = useState('');
  const [draftQuantity, setDraftQuantity] = useState(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const addedFeedbackTimeout = useRef<number | null>(null);

  const heroImages = useMemo(() => {
    const configuredImages = marketPageConfig?.hero_images?.filter(Boolean) || [];
    return configuredImages.length > 0
      ? configuredImages
      : [marketPageConfig?.hero_image_url || fallbackHeroImage];
  }, [marketPageConfig]);
  const heroIntervalMs = Math.min(60, Math.max(2, marketPageConfig?.hero_interval_seconds || 5)) * 1000;
  const categories = ['All Produce', ...dataCategories.map(category => category.name)];

  useEffect(() => {
    setActiveHeroIndex(current => current < heroImages.length ? current : 0);
  }, [heroImages.length]);

  useEffect(() => {
    if (heroImages.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveHeroIndex(current => (current + 1) % heroImages.length);
    }, heroIntervalMs);
    return () => window.clearInterval(interval);
  }, [heroImages.length, heroIntervalMs]);

  useEffect(() => () => {
    if (addedFeedbackTimeout.current) window.clearTimeout(addedFeedbackTimeout.current);
  }, []);

  const getConfiguredProductId = (product: Product, variationId?: string, portionId?: string) =>
    [product.id, variationId, portionId].filter(Boolean).join('-');

  const handleAddToCart = (product: Product, variationId?: string, portionId?: string) => {
    const variation = product.variations?.find(option => option.id === variationId);
    const portion = product.portions?.find(option => option.id === portionId);
    const configuredProduct = {
      ...product,
      id: getConfiguredProductId(product, variationId, portionId),
      productId: product.id,
      price: product.price + (variation?.price || 0) + (portion?.price || 0),
      selectedVariation: variation?.name,
      selectedPortion: portion?.name
    };
    addToCart(configuredProduct);
    setAddedId(configuredProduct.id);
    if (addedFeedbackTimeout.current) window.clearTimeout(addedFeedbackTimeout.current);
    addedFeedbackTimeout.current = window.setTimeout(() => setAddedId(null), 1500);
  };

  const filteredProducts = products.filter(product => {
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(normalizedQuery)
      || product.description.toLowerCase().includes(normalizedQuery)
      || (product.details || '').toLowerCase().includes(normalizedQuery);
    const matchesCategory = activeCategory === 'All Produce' || product.category === activeCategory;
    return product.availability !== 'hidden' && matchesSearch && matchesCategory;
  });

  const openProduct = (product: Product) => {
    const selectableVariations = product.variations?.filter(option => option.availability !== 'hidden') || [];
    const selectablePortions = product.portions?.filter(option => option.availability !== 'hidden') || [];
    const initialVariation = selectableVariations.find(option => option.availability === 'visible') || selectableVariations[0];
    const initialPortion = selectablePortions.find(option => option.availability === 'visible') || selectablePortions[0];
    setSelectedProduct(product);
    setSelectedVariationId(initialVariation?.id || '');
    setSelectedPortionId(initialPortion?.id || '');
    setIsDetailsOpen(false);
  };

  const closeProduct = () => {
    setIsDetailsOpen(false);
    setSelectedProduct(null);
  };

  const visibleVariations = selectedProduct?.variations?.filter(option => option.availability !== 'hidden') || [];
  const visiblePortions = selectedProduct?.portions?.filter(option => option.availability !== 'hidden') || [];
  const selectedVariation = visibleVariations.find(option => option.id === selectedVariationId);
  const selectedPortion = visiblePortions.find(option => option.id === selectedPortionId);
  const selectedPrice = (selectedProduct?.price || 0) + (selectedVariation?.price || 0) + (selectedPortion?.price || 0);
  const selectionUnavailable = selectedProduct?.availability === 'out_of_stock'
    || ((selectedProduct?.variations?.length || 0) > 0 && (!selectedVariation || selectedVariation.availability !== 'visible'))
    || ((selectedProduct?.portions?.length || 0) > 0 && (!selectedPortion || selectedPortion.availability !== 'visible'));
  const selectedCartItemId = selectedProduct ? getConfiguredProductId(selectedProduct, selectedVariationId, selectedPortionId) : '';
  const selectedCartItem = cart.find(item => item.id === selectedCartItemId);
  const selectedQuantity = selectedCartItem?.quantity || 0;

  useEffect(() => {
    setDraftQuantity(selectedQuantity);
  }, [selectedCartItemId, selectedQuantity]);

  const addSelectedProduct = () => {
    if (!selectedProduct || selectionUnavailable) return;
    handleAddToCart(selectedProduct, selectedVariationId, selectedPortionId);
  };

  const adjustDraftQuantity = (change: number) => {
    setDraftQuantity(current => Math.max(0, current + change));
  };

  const confirmQuantityChanges = () => {
    if (!selectedCartItem || draftQuantity === selectedQuantity) return;
    updateQuantity(selectedCartItemId, draftQuantity);
  };

  const showPreviousHero = () => {
    setActiveHeroIndex(current => (current - 1 + heroImages.length) % heroImages.length);
  };

  const showNextHero = () => {
    setActiveHeroIndex(current => (current + 1) % heroImages.length);
  };

  return (
    <div className="bg-surface min-h-screen">
      <section className="relative mx-3 md:mx-10 mt-3 md:mt-8 h-[32vh] min-h-[220px] md:h-[54vh] md:max-h-[560px] overflow-hidden rounded-xl md:rounded-2xl mb-6 md:mb-12 bg-surface-container-high">
        <AnimatePresence mode="sync" initial={false}>
          <motion.img
            key={`${activeHeroIndex}-${heroImages[activeHeroIndex]}`}
            initial={{ opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            alt={`Altitude Ally featured photo ${activeHeroIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            src={heroImages[activeHeroIndex]}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-10 max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65 }}
            className="text-2xl md:text-6xl font-serif font-black leading-tight italic text-white drop-shadow-lg"
          >
            Altitude Ally
          </motion.h1>
        </div>

        {heroImages.length > 1 && (
          <>
            <button type="button" onClick={showPreviousHero} aria-label="Previous featured photo" className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/65 transition-colors">
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button type="button" onClick={showNextHero} aria-label="Next featured photo" className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/65 transition-colors">
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2" aria-label={`${activeHeroIndex + 1} of ${heroImages.length} featured photos`}>
              {heroImages.map((_, index) => (
                <button key={index} type="button" onClick={() => setActiveHeroIndex(index)} aria-label={`Show featured photo ${index + 1}`} className={`h-2 rounded-full transition-all ${index === activeHeroIndex ? 'w-6 bg-white' : 'w-2 bg-white/55 hover:bg-white/80'}`} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="px-3 md:px-10 md:max-w-none max-w-7xl mx-auto mb-6 sticky top-16 md:top-20 z-40">
        <div className="bg-surface-bright/80 backdrop-blur-xl p-1.5 md:p-4 rounded-xl md:rounded-2xl flex flex-col md:flex-row gap-2 md:gap-4 items-center shadow-lg border border-outline-variant/15">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-3.5 h-3.5 md:w-5 md:h-5" />
            <input
              className="w-full pl-8 md:pl-12 pr-10 py-2 md:py-4 rounded-lg md:rounded-2xl bg-surface-container-low border-none focus:ring-1 md:ring-2 focus:ring-primary transition-all text-[10px] md:text-base placeholder:text-on-surface-variant/50"
              placeholder="Search harvest..."
              type="text"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
            />
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar w-full py-0.5">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 md:px-6 py-1 md:py-2.5 rounded-full text-[10px] md:text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === category ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-2 md:px-8 md:max-w-none max-w-7xl mx-auto pb-24">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 md:gap-3">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => {
                const customerVariations = product.variations?.filter(option => option.availability !== 'hidden') || [];
                const customerPortions = product.portions?.filter(option => option.availability !== 'hidden') || [];
                const visibleVariationsForPrice = customerVariations.filter(option => option.availability === 'visible');
                const visiblePortionsForPrice = customerPortions.filter(option => option.availability === 'visible');
                const minimumVariationPrice = visibleVariationsForPrice.length > 0 ? Math.min(...visibleVariationsForPrice.map(option => option.price)) : 0;
                const minimumPortionPrice = visiblePortionsForPrice.length > 0 ? Math.min(...visiblePortionsForPrice.map(option => option.price)) : 0;
                const displayPrice = product.price + minimumVariationPrice + minimumPortionPrice;
                const productUnavailable = product.availability === 'out_of_stock'
                  || ((product.variations?.length || 0) > 0 && visibleVariationsForPrice.length === 0)
                  || ((product.portions?.length || 0) > 0 && visiblePortionsForPrice.length === 0);
                const configurationCount = Math.max(1, visibleVariationsForPrice.length) * Math.max(1, visiblePortionsForPrice.length);
                return (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  whileHover={{ y: -3 }}
                  onClick={() => openProduct(product)}
                  className="group relative min-w-0 bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-surface-variant overflow-hidden relative">
                    <img alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={product.image} referrerPolicy="no-referrer" />
                    {productUnavailable && (
                      <span className="absolute left-1 top-1 md:left-2 md:top-2 px-1.5 py-1 rounded-md bg-red-600 text-white text-[7px] md:text-[9px] font-black uppercase shadow-lg">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="p-1.5 md:p-2">
                    <h3 className="min-h-6 md:min-h-8 text-[9px] md:text-xs font-bold font-serif leading-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                    <p className="font-bold text-[10px] md:text-xs text-primary truncate">{configurationCount > 1 ? 'From ' : ''}{'\u0E3F'}{displayPrice.toLocaleString()}</p>
                    <span className="mb-1.5 block truncate text-[7px] md:text-[9px] text-on-surface-variant">/ {product.unit}</span>
                    <button
                      onClick={event => {
                        event.stopPropagation();
                        openProduct(product);
                      }}
                      disabled={productUnavailable}
                      className={`w-full min-h-7 md:min-h-8 px-1 py-1 rounded-md font-bold text-[8px] md:text-[10px] flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm ${productUnavailable ? 'bg-red-100 text-red-700 cursor-not-allowed' : 'bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary'}`}
                    >
                      {productUnavailable ? 'Unavailable' : (
                        <>
                          <ShoppingCart className="hidden sm:block w-3 h-3" />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-6">
              <Leaf size={48} className="opacity-20" />
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-2 font-serif">Harvest Not Found</h3>
            <p className="text-on-surface-variant max-w-xs">We couldn't find any products matching your search or category selection.</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('All Produce'); }} className="mt-8 text-primary font-bold hover:underline">
              Clear all filters
            </button>
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeProduct} className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 24 }} className="relative w-full md:w-[min(1180px,calc(100vw-5rem))] max-h-[92vh] md:max-h-[86vh] bg-surface rounded-xl md:rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20">
              <button onClick={closeProduct} aria-label="Close product" className="absolute right-4 top-4 z-30 p-3 rounded-full bg-surface/90 text-on-surface shadow-lg hover:bg-surface-container-high transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 max-h-[92vh] md:max-h-[86vh] overflow-y-auto no-scrollbar pb-[154px] md:pb-[166px]">
                <div className="h-64 md:h-full md:min-h-[520px] bg-surface-variant">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="p-5 md:p-12 flex flex-col min-h-[440px]">
                  <div className="mb-8">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-primary mb-3">{selectedProduct.category}</p>
                    <h2 className="text-3xl md:text-5xl font-serif font-black italic text-on-surface leading-tight mb-4">{selectedProduct.name}</h2>
                    <p className="text-2xl md:text-4xl font-black text-primary font-serif">{'\u0E3F'}{selectedPrice.toLocaleString()} <span className="text-sm md:text-lg text-on-surface-variant font-sans font-semibold">/ {selectedProduct.unit}</span></p>
                  </div>

                  <div className="flex items-start gap-3 text-on-surface-variant leading-relaxed mb-8">
                    <p className="min-w-0 flex-1 text-sm md:text-lg italic">{selectedProduct.description}</p>
                    <button type="button" onClick={() => setIsDetailsOpen(true)} className="shrink-0 flex items-center gap-1.5 rounded-lg bg-surface-container-high px-3 py-2 text-[10px] md:text-xs font-black uppercase text-primary hover:bg-surface-container-highest transition-colors">
                      <Maximize2 className="h-3.5 w-3.5" />
                      Details
                    </button>
                  </div>

                  <div className="space-y-6 mb-8">
                    {visibleVariations.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 text-primary">
                          <SlidersHorizontal className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Variations</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {visibleVariations.map(option => (
                            <button key={option.id} disabled={option.availability === 'out_of_stock'} onClick={() => setSelectedVariationId(option.id)} className={`px-4 py-2 rounded-lg text-left text-xs md:text-sm font-bold transition-all ${option.availability === 'out_of_stock' ? 'bg-red-50 text-red-700 cursor-not-allowed line-through' : selectedVariationId === option.id ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}>
                              <span className="block">{option.name}</span>
                              <span className={`block text-[10px] ${selectedVariationId === option.id && option.availability === 'visible' ? 'text-on-primary/80' : 'opacity-70'}`}>+{'\u0E3F'}{option.price.toLocaleString()}{option.availability === 'out_of_stock' ? ' - Out of stock' : ''}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {visiblePortions.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 text-secondary">
                          <ShoppingCart className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Portions</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {visiblePortions.map(option => (
                            <button key={option.id} disabled={option.availability === 'out_of_stock'} onClick={() => setSelectedPortionId(option.id)} className={`px-4 py-2 rounded-lg text-left text-xs md:text-sm font-bold transition-all ${option.availability === 'out_of_stock' ? 'bg-red-50 text-red-700 cursor-not-allowed line-through' : selectedPortionId === option.id ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}>
                              <span className="block">{option.name}</span>
                              <span className={`block text-[10px] ${selectedPortionId === option.id && option.availability === 'visible' ? 'text-on-secondary/80' : 'opacity-70'}`}>+{'\u0E3F'}{option.price.toLocaleString()}{option.availability === 'out_of_stock' ? ' - Out of stock' : ''}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-0 z-20 w-full border-t border-outline-variant/15 bg-surface/95 p-4 backdrop-blur-md md:w-1/2 md:px-12 md:py-5">
                <AnimatePresence mode="wait" initial={false}>
                  {addedId === selectedCartItemId ? (
                    <motion.div key="added" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="w-full min-h-[60px] md:min-h-[68px] rounded-xl bg-emerald-600 text-white shadow-xl flex items-center justify-center gap-3 font-black text-base md:text-xl" role="status">
                      <Check className="w-5 h-5 md:w-6 md:h-6" />
                      Added to cart
                    </motion.div>
                  ) : selectedQuantity > 0 ? (
                    <motion.div key="quantity" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                      <div className="w-full min-h-[60px] md:min-h-[68px] rounded-xl bg-primary text-on-primary shadow-xl grid grid-cols-[64px_1fr_64px] md:grid-cols-[76px_1fr_76px] items-stretch overflow-hidden" aria-label={`Quantity for ${selectedProduct.name}`}>
                        <button type="button" onClick={() => adjustDraftQuantity(-1)} aria-label={`Decrease ${selectedProduct.name} quantity`} className="flex items-center justify-center border-r border-on-primary/25 hover:bg-on-primary/10 active:bg-on-primary/20 transition-colors">
                          <Minus className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <span className="flex items-center justify-center text-xl md:text-2xl font-black" aria-live="polite">{draftQuantity}</span>
                        <button type="button" onClick={() => adjustDraftQuantity(1)} aria-label={`Increase ${selectedProduct.name} quantity`} className="flex items-center justify-center border-l border-on-primary/25 hover:bg-on-primary/10 active:bg-on-primary/20 transition-colors">
                          <Plus className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {draftQuantity !== selectedQuantity && (
                          <motion.button initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} type="button" onClick={confirmQuantityChanges} className="w-full min-h-11 rounded-lg bg-secondary px-4 py-2.5 text-sm font-black text-on-secondary shadow-md hover:bg-secondary/90">
                            Confirm Changes
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.button key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={addSelectedProduct} disabled={selectionUnavailable} className={`w-full min-h-[60px] md:min-h-[68px] px-5 rounded-xl font-black text-base md:text-xl shadow-xl transition-all flex items-center justify-center gap-3 ${selectionUnavailable ? 'bg-red-100 text-red-700 cursor-not-allowed' : 'bg-primary text-on-primary hover:scale-[0.99] active:scale-95'}`}>
                      <ShoppingCart className="w-5 h-5" />
                      {selectionUnavailable ? 'Out of Stock' : 'Add Selected Options'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && isDetailsOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailsOpen(false)} className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm" />
            <motion.section initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 18 }} className="relative flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-surface shadow-2xl border border-outline-variant/20" aria-label={`${selectedProduct.name} full description`}>
              <div className="flex items-center justify-between gap-4 border-b border-outline-variant/15 p-5 md:p-7">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Full Description</p>
                  <h3 className="truncate text-2xl md:text-4xl font-serif font-black italic text-on-surface">{selectedProduct.name}</h3>
                </div>
                <button type="button" onClick={() => setIsDetailsOpen(false)} aria-label="Close full description" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-5 md:p-8">
                <p className="whitespace-pre-wrap text-sm md:text-lg leading-relaxed text-on-surface-variant">{selectedProduct.details || selectedProduct.description}</p>
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
