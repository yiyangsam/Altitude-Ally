import { 
  Contact, 
  Receipt, 
  ChevronRight, 
  ShoppingBag, 
  Edit,
  LogOut,
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function splitPhoneNumber(phone: string) {
  const match = phone.trim().match(/^(\+\d{1,4})\s*(.*)$/);
  return {
    countryCode: match?.[1] || '+66',
    phoneNumber: match?.[2] || phone.trim()
  };
}

function formatAccountDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function AccountPage() {
  const { logout, user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    countryCode: '+66',
    phoneNumber: '',
    address: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const phone = splitPhoneNumber(user.phone || '');
      setEditForm({
        name: user.name || '',
        countryCode: phone.countryCode,
        phoneNumber: phone.phoneNumber,
        address: user.address || ''
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    const phone = editForm.phoneNumber.trim()
      ? `${editForm.countryCode} ${editForm.phoneNumber.trim()}`.trim()
      : '';
    const success = await updateProfile({
      name: editForm.name,
      phone,
      address: editForm.address
    });
    setIsSaving(false);
    if (success) setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="bg-surface min-h-screen">
      <main className="max-w-7xl mx-auto px-3 md:px-6 pt-6 md:pt-12 pb-20 md:pb-32">
        {/* User Hero */}
        <section className="relative mb-8 md:mb-16">
          <div className="bg-surface-container-low rounded-2xl md:rounded-[3rem] p-4 md:p-16 overflow-hidden flex flex-col md:flex-row gap-6 md:gap-12 items-center relative shadow-sm border border-outline-variant/10">
            <div className="relative w-24 h-24 md:w-72 md:h-72 flex-shrink-0 group">
              <div className="absolute inset-0 bg-secondary-container rounded-2xl md:rounded-[3.5rem] rotate-6 group-hover:rotate-12 transition-transform shadow-lg"></div>
              <img 
                className="absolute inset-0 w-full h-full object-cover rounded-xl md:rounded-[3rem] -rotate-3 border-2 md:border-8 border-surface-container-lowest shadow-xl transition-transform group-hover:rotate-0" 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=256`}
                referrerPolicy="no-referrer"
                alt="Profile avatar"
              />
            </div>
            
            <div className="flex-grow text-center md:text-left z-10 w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                <div className="w-full">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                       <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         className="mb-1 md:mb-3"
                       >
                         <input 
                           type="text" 
                           value={editForm.name}
                           onChange={e => setEditForm({...editForm, name: e.target.value})}
                           className="bg-surface-container-lowest text-2xl md:text-7xl font-serif font-black text-on-surface tracking-tighter w-full border-b-2 border-primary focus:outline-none py-1 transition-all"
                         />
                       </motion.div>
                    ) : (
                      <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                      >
                         <h2 className="text-2xl md:text-7xl font-serif font-black text-on-surface mb-1 md:mb-3 tracking-tighter">{user.name}</h2>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <p className="text-secondary font-medium text-sm md:text-xl font-serif">{formatAccountDate(user.joinedDate)}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-error/10 text-error px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-bold flex flex-shrink-0 items-center justify-center gap-1.5 hover:bg-error/20 transition-all text-[10px] md:text-sm group mx-auto md:mx-0"
                >
                  <LogOut className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform" />
                  Sign Out
                </button>
              </div>
              
              <div className="mt-4 md:mt-8 flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-primary to-primary-container text-white px-4 md:px-10 py-2 md:py-4 rounded-lg md:rounded-2xl font-bold flex items-center gap-1.5 md:gap-3 shadow-lg hover:scale-105 active:scale-95 transition-all text-[11px] md:text-base disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5 md:w-5 md:h-5" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        const phone = splitPhoneNumber(user.phone || '');
                        setEditForm({
                          name: user.name || '',
                          countryCode: phone.countryCode,
                          phoneNumber: phone.phoneNumber,
                          address: user.address || ''
                        });
                      }}
                      className="bg-surface-container-highest text-on-surface px-4 md:px-10 py-2 md:py-4 rounded-lg md:rounded-2xl font-bold flex items-center gap-1.5 md:gap-3 hover:bg-surface-container-high transition-all text-[11px] md:text-base"
                    >
                      <X className="w-3.5 h-3.5 md:w-5 md:h-5" />
                      Discard
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-primary to-primary-container text-white px-4 md:px-10 py-2 md:py-4 rounded-lg md:rounded-2xl font-bold flex items-center gap-1.5 md:gap-3 shadow-lg hover:scale-105 active:scale-95 transition-all text-[11px] md:text-base"
                  >
                    <Edit className="w-3.5 h-3.5 md:w-5 md:h-5" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Details Sidebar */}
          <div className="lg:col-span-1 space-y-8 md:space-y-12">
            <section>
              <h3 className="font-serif text-xl md:text-3xl font-bold text-secondary mb-4 md:mb-8 flex items-center gap-3 italic">
                <Contact className="text-primary w-5 h-5 md:w-6 md:h-6" />
                Contact info
              </h3>
              <div className="bg-surface-container-lowest rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-8 shadow-sm border border-outline-variant/10">
                <div className="space-y-0.5 md:space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-outline opacity-70">Email Address (Fixed)</label>
                  <p className="text-on-surface font-semibold text-sm md:text-xl font-serif">{user.email}</p>
                </div>
                
                <div className="space-y-0.5 md:space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-outline opacity-70">Phone Number</label>
                  {isEditing ? (
                    <div className="flex gap-2 md:gap-3">
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={editForm.countryCode}
                        onChange={e => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setEditForm({ ...editForm, countryCode: `+${digits}` });
                        }}
                        className="w-20 flex-shrink-0 text-on-surface bg-surface-container-low font-semibold text-sm md:text-lg font-serif border-2 border-transparent focus:border-primary focus:outline-none rounded-lg px-3 py-3 md:py-4"
                        placeholder="+66"
                        aria-label="Country code"
                      />
                      <input
                        type="tel"
                        value={editForm.phoneNumber}
                        onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})}
                        className="min-w-0 flex-1 text-on-surface bg-surface-container-low font-semibold text-sm md:text-lg font-serif border-2 border-transparent focus:border-primary focus:outline-none rounded-lg px-3 py-3 md:py-4"
                        placeholder="Phone number"
                        aria-label="Phone number"
                      />
                    </div>
                  ) : (
                    <p className="text-on-surface font-semibold text-sm md:text-xl font-serif">
                       {user.phone || <span className="text-outline italic">Not provided</span>}
                    </p>
                  )}
                </div>

                <div className="space-y-0.5 md:space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-outline opacity-70">Address</label>
                  {isEditing ? (
                    <textarea 
                       value={editForm.address}
                       onChange={e => setEditForm({...editForm, address: e.target.value})}
                       className="text-on-surface bg-surface-container-low font-semibold text-sm md:text-lg font-serif border-2 border-transparent focus:border-primary focus:outline-none w-full rounded-lg px-3 py-3 md:py-4 min-h-28 md:min-h-32 resize-y"
                       placeholder="Enter full address"
                    />
                  ) : (
                    <p className="text-on-surface font-semibold text-sm md:text-xl font-serif leading-relaxed italic">
                      {user.address || <span className="text-outline">No address recorded</span>}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Harvest History */}
          <div className="lg:col-span-2">
            <section>
              <div className="flex justify-between items-end mb-6 md:mb-8">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-secondary flex items-center gap-3 italic">
                  <Receipt className="text-primary" />
                  Harvest History
                </h3>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                {(user.orders && user.orders.length > 0) ? user.orders.map((order, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    className="bg-surface-container-lowest rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center hover:bg-surface-container-low transition-all shadow-sm border border-outline-variant/10 group"
                  >
                    <div className="bg-surface-container-high w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-3xl flex items-center justify-center flex-shrink-0 text-primary shadow-inner">
                    <ShoppingBag className="w-5 h-5 md:w-8 md:h-8" />
                    </div>
                    <div className="flex-grow w-full">
                      <div className="flex justify-between items-start mb-2 md:mb-4">
                        <div>
                          <h4 className="font-bold text-sm md:text-2xl mb-0.5 font-serif line-clamp-1">Order {order.id}</h4>
                          <p className="text-on-surface-variant text-[9px] md:text-sm font-medium italic">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-sm md:text-2xl text-on-surface font-serif">฿{order.total.toLocaleString()}</p>
                          <span className={`inline-flex items-center gap-1 px-1.5 md:px-3 py-0.5 md:py-1 rounded text-[8px] md:text-[10px] font-black uppercase tracking-widest mt-1 md:mt-2 ${order.status === 'Pending' ? 'text-tertiary-container bg-tertiary-fixed' : 'text-primary-container bg-primary-fixed'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        {order.items.map((item, j) => (
                          <span key={j} className="bg-surface-container-high text-on-surface-variant px-2 md:px-4 py-0.5 rounded-md md:rounded-xl text-[8px] md:text-xs font-semibold">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="text-outline group-hover:text-primary transition-colors p-2 hidden lg:block">
                      <ChevronRight size={32} />
                    </button>
                  </motion.div>
                )) : (
                  <div className="text-center py-12 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10">
                     <p className="text-on-surface-variant italic font-serif">You haven't made any harvest orders yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
