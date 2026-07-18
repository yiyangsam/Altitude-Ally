import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';
import { useData } from '../lib/DataContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Edit3, 
  ChevronRight,
  QrCode,
  Instagram,
  Mail,
  MessageCircle,
  Facebook,
  User as UserIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user, updateProfile, isLoggedIn, addOrder: addUserOrder } = useAuth();
  const { addOrder: addGlobalOrder, paymentConfig, footerPageConfig } = useData();
  const navigate = useNavigate();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'basket' | 'details' | 'payment'>('basket');
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [tempDetails, setTempDetails] = useState({
    address: user?.address || '',
    phone: user?.phone || ''
  });

  const grandTotal = totalPrice;
  const paymentBankInfo = paymentConfig?.bank_info
    .replace(/\s*\(Altitude Collectives\)\s*/gi, ' ')
    .trim();

  const handleNextStep = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setCheckoutStep('details');
  };

  const handleSaveDetails = () => {
    updateProfile(tempDetails);
    setIsEditingDetails(false);
  };

  const handleConfirmOrder = async () => {
    if (!isConfirmed || isEditingDetails || isSubmittingOrder || isOrderSubmitted) return;
    if (!user) {
      setOrderError('Please wait for your account details to finish loading.');
      return;
    }

    setIsSubmittingOrder(true);
    setOrderError('');

    const orderItems = cart.map(item => `${item.quantity}x ${item.name}`);

    try {
      const createdOrder = await addGlobalOrder({
        user_id: user.id,
        customerName: user.name,
        total: grandTotal,
        items: orderItems
      });

      addUserOrder({
        id: createdOrder.id,
        date: createdOrder.date,
        total: Number(createdOrder.total),
        items: createdOrder.items,
        status: createdOrder.status
      });
      setIsOrderSubmitted(true);
      setCheckoutStep('payment');
    } catch (error) {
      console.error('Unable to submit order:', error);
      setOrderError('We could not confirm your order. Please try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleCheckout = () => {
    if (checkoutStep !== 'payment' || !isOrderSubmitted) return;

    clearCart();
    setIsSuccess(true);
  };

  if (isSuccess) {
    const contactDetails = [
      { label: 'Instagram', value: footerPageConfig?.instagram || 'Instagram details coming soon.', icon: Instagram },
      { label: 'Email', value: footerPageConfig?.email || 'Email details coming soon.', icon: Mail },
      { label: 'LINE', value: footerPageConfig?.line || 'LINE details coming soon.', icon: MessageCircle },
      { label: 'Facebook', value: footerPageConfig?.facebook || 'Facebook details coming soon.', icon: Facebook }
    ];

    return (
      <div className="min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)] bg-surface flex items-center justify-center px-4 py-8 md:py-12">
        <motion.section
          aria-live="polite"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-surface-container-lowest p-6 md:p-10 rounded-2xl text-center shadow-2xl border border-outline-variant/10"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 animate-in zoom-in duration-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-on-surface italic">Order Registered</h2>

          <div className="mt-8 border-t border-outline-variant/20 pt-7 text-left">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-on-surface mb-4">How to Contact Us</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {contactDetails.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex min-w-0 items-start gap-3 rounded-xl bg-surface-container-low p-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant">{label}</p>
                    <p className="mt-1 break-words text-sm text-on-surface">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base md:text-lg font-bold text-on-primary shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </motion.section>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pt-4 pb-12 md:pt-12 md:pb-24 px-3 md:px-6">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-primary font-bold mb-6 md:mb-12 hover:translate-x-[-4px] transition-transform text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          Back
        </button>

        <h1 className="text-2xl md:text-5xl font-serif font-black text-on-surface mb-6 md:mb-12 underline md:no-underline decoration-primary/20 leading-tight">
          {checkoutStep === 'basket' ? 'Your Basket' : checkoutStep === 'details' ? 'Confirm Delivery' : 'Make Payment'}
        </h1>

        {cart.length === 0 ? (
          <div className="bg-surface-container-low rounded-[3rem] p-24 text-center">
            <h2 className="text-3xl font-serif font-bold text-on-surface mb-4">Your basket is empty</h2>
            <p className="text-on-surface-variant mb-12 italic">Looks like you haven't gathered anything from the highlands yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-primary text-on-primary px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:scale-105 transition-all"
            >
              Start Gathering
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="wait">
                {checkoutStep === 'basket' ? (
                  <motion.div 
                    key="basket-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {cart.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        className="bg-surface-container-lowest p-3 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col md:flex-row gap-4 md:gap-8 items-center border border-outline-variant/10 shadow-sm"
                      >
                        <div className="w-16 h-16 md:w-32 md:h-32 rounded-xl md:rounded-3xl overflow-hidden flex-shrink-0 shadow-md">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        
                        <div className="flex-grow text-center md:text-left">
                          <h3 className="text-base md:text-2xl font-bold font-serif mb-0.5">{item.name}</h3>
                          <p className="text-on-surface-variant text-[10px] md:text-sm mb-3 md:mb-4 italic">Per {item.unit}</p>
                          {(item.selectedVariation || item.selectedPortion) && (
                            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mb-3">
                              {item.selectedVariation && (
                                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[9px] md:text-xs font-bold">{item.selectedVariation}</span>
                              )}
                              {item.selectedPortion && (
                                <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-[9px] md:text-xs font-bold">{item.selectedPortion}</span>
                              )}
                            </div>
                          )}
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-error font-bold text-[10px] md:text-sm flex items-center gap-1.5 mx-auto md:mx-0 hover:underline"
                          >
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            Remove
                          </button>
                        </div>

                        <div className="flex items-center gap-4 md:gap-6 bg-surface-container-low px-4 py-2 rounded-xl">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-primary transition-colors text-primary"
                          >
                            <Minus className="w-3.5 h-3.5 md:w-5 md:h-5" />
                          </button>
                          <span className="font-bold text-sm md:text-xl min-w-[1rem] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-primary transition-colors text-primary"
                          >
                            <Plus className="w-3.5 h-3.5 md:w-5 md:h-5" />
                          </button>
                        </div>

                        <div className="text-center md:text-right min-w-[80px]">
                          <p className="text-lg md:text-2xl font-black text-primary font-serif">฿{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-[9px] md:text-xs text-on-surface-variant">฿{item.price.toLocaleString()} / unit</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="details-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="bg-surface-container-lowest p-4 md:p-10 rounded-2xl md:rounded-[3rem] border border-outline-variant/10 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-primary" />
                      
                      <div className="flex justify-between items-start mb-6 md:mb-10">
                        <div className="flex items-center gap-2.5 md:gap-4">
                          <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <UserIcon className="w-4 h-4 md:w-6 md:h-6" />
                          </div>
                          <div>
                            <h3 className="text-base md:text-2xl font-bold font-serif">Contact Info</h3>
                          </div>
                        </div>
                        {!isEditingDetails && checkoutStep === 'details' && (
                          <button 
                            onClick={() => setIsEditingDetails(true)}
                            className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-primary"
                          >
                            <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        )}
                      </div>

                      {isEditingDetails ? (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1 font-sans">Full Name</label>
                            <input 
                              type="text" 
                              className="w-full bg-surface-container-low px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary font-serif"
                              value={user?.name || ''}
                              disabled
                            />
                            <p className="text-[10px] text-on-surface-variant italic px-1 italic">Contact admin to change full name</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1 font-sans">Telephone Number</label>
                            <div className="relative">
                              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                              <input 
                                type="tel" 
                                className="w-full bg-surface-container-low pl-14 pr-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary font-serif"
                                value={tempDetails.phone}
                                onChange={(e) => setTempDetails({ ...tempDetails, phone: e.target.value })}
                                placeholder="+66 XX XXX XXXX"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1 font-sans">Delivery Address</label>
                            <div className="relative">
                              <MapPin className="absolute left-6 top-5 text-on-surface-variant" size={20} />
                              <textarea 
                                className="w-full bg-surface-container-low pl-14 pr-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary font-serif min-h-[120px]"
                                value={tempDetails.address}
                                onChange={(e) => setTempDetails({ ...tempDetails, address: e.target.value })}
                                placeholder="Enter your full address in the mountain region..."
                              />
                            </div>
                          </div>
                          <div className="flex gap-4 pt-4">
                            <button 
                              onClick={handleSaveDetails}
                              className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
                            >
                              Save Details
                            </button>
                            <button 
                              onClick={() => {
                                setTempDetails({ address: user?.address || '', phone: user?.phone || '' });
                                setIsEditingDetails(false);
                              }}
                              className="px-8 bg-surface-container-high text-on-surface py-4 rounded-2xl font-bold hover:bg-surface-container-highest transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Telephone</span>
                              <p className="text-xl font-serif font-bold text-on-surface flex items-center gap-3">
                                <Phone size={18} className="text-primary" />
                                {user?.phone}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Recipient</span>
                              <p className="text-xl font-serif font-bold text-on-surface flex items-center gap-3">
                                <UserIcon size={18} className="text-primary" />
                                {user?.name}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1 pt-4 border-t border-outline-variant/15">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Drop-off Location</span>
                            <div className="flex gap-3">
                              <MapPin size={22} className="text-primary flex-shrink-0 mt-0.5" />
                              <p className="text-lg font-serif italic text-on-surface leading-relaxed">
                                {user?.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {checkoutStep === 'details' && !isEditingDetails && (
                      <label className="flex items-center gap-3 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10 cursor-pointer hover:bg-surface-container-low transition-colors group shadow-sm">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="peer sr-only" 
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                          />
                          <div className="w-5 h-5 border-2 border-outline-variant rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                            <CheckCircle2 className={`text-on-primary w-3.5 h-3.5 transition-transform ${isConfirmed ? 'scale-100' : 'scale-0'}`} />
                          </div>
                        </div>
                        <span className="font-bold text-[11px] md:text-base text-on-surface italic group-hover:text-primary transition-colors">I confirm all details are accurate.</span>
                      </label>
                    )}

                    <div className="bg-surface-container-low rounded-2xl md:rounded-[2rem] p-5 md:p-8">
                      <h4 className="font-serif font-bold mb-3 italic text-on-surface-variant px-1 text-sm md:text-base">Basket Overview</h4>
                      <div className="space-y-2">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-xs md:text-sm font-medium">
                            <span className="text-on-surface italic line-clamp-1 pr-4">{item.quantity}x {item.name}</span>
                            <span className="text-on-surface-variant whitespace-nowrap">฿{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'details' : 'basket')}
                      className="text-primary font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
                    >
                      <ArrowLeft size={18} />
                      {checkoutStep === 'payment' ? 'Back to Details' : 'Adjust Basket'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface-container-high rounded-2xl md:rounded-[3rem] p-6 md:p-10 sticky top-32 shadow-xl border border-outline-variant/10">
                <h3 className="text-xl md:text-3xl font-serif font-bold mb-4 md:mb-8 italic">Harvest Summary</h3>
                
                <div className="space-y-3 mb-6 md:mb-10 pb-4 md:pb-8 border-b border-outline-variant/20">
                  <div className="flex justify-between text-on-surface-variant font-medium text-xs md:text-sm">
                    <span>Subtotal</span>
                    <span className="text-on-surface">฿{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-6 md:mb-12">
                  <span className="text-[10px] md:text-sm font-black uppercase tracking-widest text-secondary">Total Due</span>
                  <span className="text-3xl md:text-5xl font-black text-primary font-serif">฿{grandTotal.toLocaleString()}</span>
                </div>

                {checkoutStep === 'basket' ? (
                  <button 
                    onClick={handleNextStep}
                    className="w-full py-4 md:py-6 rounded-xl md:rounded-2xl bg-primary text-on-primary font-bold text-base md:text-xl shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6"
                  >
                    Continue to Details
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                ) : checkoutStep === 'details' ? (
                  <div className="space-y-6">
                    <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
                      <QrCode className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <p className="leading-relaxed">On the next page, scan the QR code to complete your payment.</p>
                    </div>
                    <button 
                      onClick={handleConfirmOrder}
                      disabled={!isConfirmed || isEditingDetails || isSubmittingOrder || isOrderSubmitted}
                      className={`w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-bold text-base md:text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6 ${
                        isConfirmed && !isEditingDetails && !isSubmittingOrder && !isOrderSubmitted
                        ? 'bg-primary text-on-primary hover:scale-[1.02]' 
                        : 'bg-surface-container-highest text-outline opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {isSubmittingOrder ? 'Confirming Order...' : 'Confirm Order, Await Payment'}
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    {orderError && (
                      <p role="alert" className="text-center text-sm font-bold text-error">
                        {orderError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {paymentConfig && (
                      <div className="bg-surface p-4 md:p-6 rounded-2xl border border-outline-variant/20 shadow-inner flex flex-col items-center text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline mb-4">Complete Payment via Transfer</p>
                        {paymentConfig.qr_image ? (
                          <img src={paymentConfig.qr_image} alt="Payment QR" className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-xl mb-4 bg-surface-container-low" />
                        ) : (
                          <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl bg-surface-container-lowest border border-dashed border-outline-variant/30 flex items-center justify-center text-outline text-[10px] uppercase mb-4">No QR Configured</div>
                        )}
                        <p className="font-serif text-sm md:text-base text-on-surface whitespace-pre-wrap font-bold italic">{paymentBankInfo}</p>
                      </div>
                    )}
                    
                    <button 
                      onClick={handleCheckout}
                      className="w-full py-4 md:py-6 rounded-xl md:rounded-2xl bg-primary text-on-primary font-bold text-base md:text-xl shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6"
                    >
                      <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                      Confirm Payment
                    </button>
                  </div>
                )}

                {isEditingDetails && checkoutStep === 'details' && (
                  <p className="text-center text-xs text-error font-bold mb-6 animate-pulse">
                    Please save your details to proceed
                  </p>
                )}

                <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium justify-center italic">
                  <ShieldCheck size={16} className="text-secondary" />
                  Secure Highland Community Transaction
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
