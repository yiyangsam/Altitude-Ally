import { 
  PlusCircle, 
  Package, 
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Leaf,
  X,
  Image as ImageIcon,
  Tag,
  Edit2,
  Trash2,
  Home,
  ShieldCheck,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../lib/DataContext';
import { useAuth } from '../lib/AuthContext';
import { QrCode } from 'lucide-react';

export default function OperatorDashboard() {
  const { products, orders, users, categories, impactProjects, paymentConfig, impactPageConfig, marketPageConfig, addProduct, updateProduct, deleteProduct, updateOrder, addCategory, deleteCategory, addImpactProject, updateImpactProject, deleteImpactProject, updatePaymentConfig, updateImpactPageConfig, updateMarketPageConfig } = useData();
  const { adminUser, adminPass, updateAdminCredentials } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPageConfigModalOpen, setIsPageConfigModalOpen] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<'main' | 'impact'>('main');
  const [isViewAllOrdersOpen, setIsViewAllOrdersOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [paymentForm, setPaymentForm] = useState({
    qr_image: '',
    bank_info: ''
  });

  const [marketPageForm, setMarketPageForm] = useState({
    hero_image_url: ''
  });
  const [impactPageForm, setImpactPageForm] = useState({
    hero_title: '',
    hero_description: '',
    families_served: '',
    transparency_stats: [
      { label: '', value: 0, color: 'bg-primary' },
      { label: '', value: 0, color: 'bg-primary-fixed-dim' },
      { label: '', value: 0, color: 'bg-tertiary-fixed-dim' }
    ]
  });

  useEffect(() => {
    if (paymentConfig) {
      setPaymentForm({
        qr_image: paymentConfig.qr_image,
        bank_info: paymentConfig.bank_info
      });
    }
  }, [paymentConfig]);

  useEffect(() => {
    if (impactPageConfig) {
      setImpactPageForm({
        hero_title: impactPageConfig.hero_title || '',
        hero_description: impactPageConfig.hero_description || '',
        families_served: impactPageConfig.families_served || '',
        transparency_stats: impactPageConfig.transparency_stats || [
          { label: '', value: 0, color: 'bg-primary' },
          { label: '', value: 0, color: 'bg-primary-fixed-dim' },
          { label: '', value: 0, color: 'bg-tertiary-fixed-dim' }
        ]
      });
    }
  }, [impactPageConfig]);

  useEffect(() => {
    if (marketPageConfig) {
      setMarketPageForm({
        hero_image_url: marketPageConfig.hero_image_url || ''
      });
    }
  }, [marketPageConfig]);

  useEffect(() => {
    const isAnyModalOpen = isAddModalOpen || isInventoryModalOpen || isCategoriesModalOpen || isImpactModalOpen || isPaymentModalOpen || isViewAllOrdersOpen || isPageConfigModalOpen || !!selectedOrderId || !!selectedUserEmail;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAddModalOpen, isInventoryModalOpen, isCategoriesModalOpen, isImpactModalOpen, isPaymentModalOpen, isViewAllOrdersOpen, isPageConfigModalOpen, selectedOrderId, selectedUserEmail]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    unit: 'kg',
    description: '',
    details: '',
    category: categories[0]?.name || 'Uncategorized',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000',
    variations: '',
    portions: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    unit: 'kg',
    category: categories[0]?.name || 'Uncategorized',
    description: '',
    details: '',
    image: '',
    variations: '',
    portions: ''
  });

  const [newImpactProject, setNewImpactProject] = useState({
    title: '',
    tag: 'Education',
    amount: '',
    status: 'Wait' as 'Active' | 'Wait' | 'Done',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb75bb44?auto=format&fit=crop&q=80&w=1000'
  });
  const [editingImpactId, setEditingImpactId] = useState<string | null>(null);
  const [editImpactForm, setEditImpactForm] = useState({
    title: '',
    tag: '',
    amount: '',
    status: 'Wait' as 'Active' | 'Wait' | 'Done',
    image: ''
  });

  const [newCategoryName, setNewCategoryName] = useState('');

  const [adminForm, setAdminForm] = useState({
    username: adminUser,
    password: adminPass,
    confirmPassword: adminPass
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminStatus, setShowAdminStatus] = useState(false);
  const [adminError, setAdminError] = useState('');

  const parseOptionList = (value: string) => value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      ...newProduct,
      price: parseFloat(newProduct.price) || 0,
      variations: parseOptionList(newProduct.variations),
      portions: parseOptionList(newProduct.portions)
    });
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      price: '',
      unit: 'kg',
      description: '',
      details: '',
      category: categories[0]?.name || 'Uncategorized',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000',
      variations: '',
      portions: ''
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, {
        name: editForm.name,
        price: parseFloat(editForm.price) || 0,
        unit: editForm.unit,
        category: editForm.category,
        description: editForm.description,
        details: editForm.details,
        image: editForm.image,
        variations: parseOptionList(editForm.variations),
        portions: parseOptionList(editForm.portions)
      });
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setConfirmDeleteId(null);
    if (editingId === id) setEditingId(null);
  };

  const handleImpactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addImpactProject(newImpactProject);
    setNewImpactProject({
      title: '',
      tag: 'Education',
      amount: '',
      status: 'Wait',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb75bb44?auto=format&fit=crop&q=80&w=1000'
    });
  };

  const handleUpdateImpactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingImpactId) {
      updateImpactProject(editingImpactId, editImpactForm);
      setEditingImpactId(null);
    }
  };

  const handleDeleteImpact = (id: string) => {
    deleteImpactProject(id);
    setConfirmDeleteId(null);
    if (editingImpactId === id) setEditingImpactId(null);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentConfig(paymentForm);
    setIsPaymentModalOpen(false);
  };

  const handleImpactPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateImpactPageConfig(impactPageForm);
    setIsPageConfigModalOpen(false);
  };

  const handleMarketPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMarketPageConfig(marketPageForm);
    setIsPageConfigModalOpen(false);
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const selectedUser = users.find(u => u.email === selectedUserEmail);

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        {/* Welcome Section */}
        <section className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-on-surface leading-tight mb-3 font-serif">Operator Console</h1>
            <p className="text-on-surface-variant text-lg">Managing the community harvest for today, April 17th.</p>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-6 py-3 bg-surface-container-high text-primary rounded-2xl font-bold hover:bg-primary/10 transition-all shadow-sm group"
          >
            <Home size={20} className="group-hover:-translate-y-0.5 transition-transform" />
            <span>Home</span>
          </Link>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-16">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex flex-col items-start justify-between p-6 md:p-8 bg-primary-container text-on-primary-container rounded-[2rem] aspect-square shadow-xl hover:scale-95 transition-all group"
          >
            <PlusCircle className="group-hover:rotate-90 transition-transform" size={40} />
            <span className="font-bold text-left text-base md:text-lg leading-tight font-serif uppercase tracking-tight">Add New<br/>Product</span>
          </button>
          <button 
            onClick={() => setIsInventoryModalOpen(true)}
            className="flex flex-col items-start justify-between p-6 md:p-8 bg-surface-container-high text-on-surface rounded-[2rem] aspect-square shadow-sm hover:scale-95 transition-all"
          >
            <Package className="text-primary" size={40} />
            <span className="font-bold text-left text-base md:text-lg leading-tight font-serif uppercase tracking-tight">Update<br/>Inventory</span>
          </button>
          <button 
            onClick={() => setIsCategoriesModalOpen(true)}
            className="flex flex-col items-start justify-between p-6 md:p-8 bg-secondary-container text-on-secondary-container rounded-[2rem] aspect-square shadow-sm hover:scale-95 transition-all"
          >
            <Tag className="text-secondary" size={40} />
            <span className="font-bold text-left text-base md:text-lg leading-tight font-serif uppercase tracking-tight">Manage<br/>Categories</span>
          </button>
          <button 
            onClick={() => setIsImpactModalOpen(true)}
            className="flex flex-col items-start justify-between p-6 md:p-8 bg-tertiary-container text-on-tertiary-container rounded-[2rem] aspect-square shadow-sm hover:scale-95 transition-all group"
          >
            <Leaf className="group-hover:rotate-12 transition-transform text-tertiary" size={40} />
            <span className="font-bold text-left text-base md:text-lg leading-tight font-serif uppercase tracking-tight">Impact<br/>Projects</span>
          </button>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex flex-col items-start justify-between p-6 md:p-8 bg-surface-container-highest text-on-surface rounded-[2rem] aspect-square shadow-sm hover:scale-95 transition-all group"
          >
            <QrCode className="text-secondary" size={40} />
            <span className="font-bold text-left text-base md:text-lg leading-tight font-serif uppercase tracking-tight">Payment<br/>Setup</span>
          </button>
          <button 
            onClick={() => setIsPageConfigModalOpen(true)}
            className="flex flex-col items-start justify-between p-6 md:p-8 bg-surface-container-high text-on-surface rounded-[2rem] aspect-square shadow-sm hover:scale-95 transition-all group"
          >
            <Edit2 className="text-primary" size={40} />
            <span className="font-bold text-left text-base md:text-lg leading-tight font-serif uppercase tracking-tight">Page<br/>Config</span>
          </button>
        </section>

        {/* Order Tracking */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-3xl font-bold text-on-surface font-serif italic">Order Tracking</h2>
            <button 
              onClick={() => setIsViewAllOrdersOpen(true)}
              className="text-primary text-sm font-bold uppercase tracking-widest border-b-2 border-primary-fixed"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-surface-container-low p-12 rounded-[2rem] text-center border border-dashed border-outline-variant">
                <p className="text-on-surface-variant italic">No orders recorded yet today.</p>
              </div>
            ) : (
              orders.slice(0, 5).map((order, i) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedOrderId(order.id)}
                  className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/30 flex justify-between items-center hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-xl text-on-surface">{order.customerName}</p>
                    <p className="text-sm text-on-surface-variant italic">Order {order.id} • ฿{order.total.toLocaleString()}</p>
                    <div className="flex gap-2 mt-2">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="text-[9px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-surface-container-highest shadow-sm`}>
                    {order.status}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* User Management */}
        <section className="mb-0">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-3xl font-bold text-on-surface font-serif italic">Community Members</h2>
          </div>
          <div className="relative mb-6 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={24} />
            <input 
              className="w-full pl-16 pr-6 py-5 bg-surface-container rounded-3xl border-none text-lg placeholder:text-on-surface-variant/40 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm" 
              placeholder="Search members..." 
              type="text"
            />
          </div>
          <div className="bg-surface-container-lowest rounded-[2.5rem] overflow-hidden border border-outline-variant/30 shadow-sm">
            <div className="divide-y divide-outline-variant/10">
              {users.map((user, i) => (
                <div 
                  key={user.email} 
                  onClick={() => setSelectedUserEmail(user.email)}
                  className="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg shadow-inner">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-xl text-on-surface">{user.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-extrabold text-secondary tracking-widest">{user.role}</span>
                        <span className="text-[10px] text-on-surface-variant opacity-60">• {user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Joined</p>
                    <p className="font-bold text-lg text-primary">{user.joinedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Admin Credential Management */}
        <section className="mt-24 border-t border-outline-variant/20 pt-16">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Security Settings</span>
              </div>
              <h2 className="text-3xl font-bold text-on-surface font-serif italic mb-4">Operator Credentials</h2>
              <p className="text-on-surface-variant leading-relaxed">Modify the access keys for this console. These changes take effect immediately on next login.</p>
            </div>
            
            <div className="w-full md:w-[400px] bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/20 shadow-sm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Username</label>
                  <input 
                    className="w-full px-5 py-4 bg-surface-container-lowest border-none rounded-2xl text-base font-serif" 
                    value={adminForm.username}
                    onChange={e => setAdminForm({...adminForm, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Security Key</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      className="w-full px-5 py-4 bg-surface-container-lowest border-none rounded-2xl text-base font-serif pr-14" 
                      value={adminForm.password}
                      onChange={e => setAdminForm({...adminForm, password: e.target.value})}
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-outline/40 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Confirm Security Key</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="w-full px-5 py-4 bg-surface-container-lowest border-none rounded-2xl text-base font-serif" 
                    value={adminForm.confirmPassword}
                    onChange={e => setAdminForm({...adminForm, confirmPassword: e.target.value})}
                  />
                </div>

                {adminForm.password !== adminForm.confirmPassword && adminForm.confirmPassword !== '' && (
                  <p className="text-[10px] font-bold text-error uppercase tracking-widest text-center">Keys do not match</p>
                )}

                <button 
                  disabled={adminForm.password !== adminForm.confirmPassword || !adminForm.username || !adminForm.password}
                  onClick={() => {
                    if (adminForm.password === adminForm.confirmPassword) {
                      updateAdminCredentials(adminForm.username, adminForm.password);
                      setShowAdminStatus(true);
                      setAdminError('');
                      setTimeout(() => setShowAdminStatus(false), 3000);
                    }
                  }}
                  className="w-full py-4 bg-on-surface text-surface rounded-2xl font-bold hover:bg-primary disabled:opacity-30 disabled:hover:bg-on-surface transition-all flex items-center justify-center gap-2"
                >
                  {showAdminStatus ? (
                    <>
                      <Check size={18} />
                      <span>Security Updated</span>
                    </>
                  ) : (
                    <span>Update Access Keys</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-surface rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20"
            >
              <div className="p-8 md:p-12 border-b border-outline-variant/10 flex justify-between items-center">
                <h2 className="text-3xl font-serif font-black italic text-primary">Add New Product</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Product Name</label>
                    <div className="relative">
                      <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-outline/40" size={20} />
                      <input 
                        required
                        className="block w-full pl-14 pr-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif" 
                        placeholder="e.g. Organic Basil"
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Market Price (฿)</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-outline/40 font-bold text-lg select-none">฿</span>
                      <input 
                        required
                        type="number"
                        step="1"
                        className="block w-full pl-14 pr-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif" 
                        placeholder="0"
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Sale Unit</label>
                    <select 
                      className="block w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif appearance-none"
                      value={newProduct.unit}
                      onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                    >
                      <option>kg</option>
                      <option>g</option>
                      <option>each</option>
                      <option>bunch</option>
                      <option>bag</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Category</label>
                    <select 
                      className="block w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif appearance-none"
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Description</label>
                  <textarea 
                    required
                    className="block w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif min-h-[100px]" 
                    placeholder="Describe the harvest..."
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Detailed Description</label>
                  <textarea 
                    className="block w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif min-h-[120px]" 
                    placeholder="Add care notes, origin, taste, delivery details, or anything shoppers should know..."
                    value={newProduct.details}
                    onChange={e => setNewProduct({...newProduct, details: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Variations</label>
                    <input 
                      className="block w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif" 
                      placeholder="Red, Green, Mixed"
                      value={newProduct.variations}
                      onChange={e => setNewProduct({...newProduct, variations: e.target.value})}
                    />
                    <p className="text-[10px] text-on-surface-variant ml-2">Separate choices with commas.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Portions</label>
                    <input 
                      className="block w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif" 
                      placeholder="250g, 500g, 1kg"
                      value={newProduct.portions}
                      onChange={e => setNewProduct({...newProduct, portions: e.target.value})}
                    />
                    <p className="text-[10px] text-on-surface-variant ml-2">Separate choices with commas.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-outline/40" size={20} />
                    <input 
                      required
                      className="block w-full pl-14 pr-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif" 
                      placeholder="https://..."
                      value={newProduct.image}
                      onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-primary text-on-primary rounded-[2rem] font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4"
                >
                  Confirm & List Product
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Update Inventory Modal */}
      <AnimatePresence>
        {isInventoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsInventoryModalOpen(false)} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-surface rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center text-primary">
                <h2 className="text-2xl font-serif font-black italic">Update Inventory</h2>
                <button onClick={() => setIsInventoryModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X /></button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-6">
                {products.map(p => (
                  <div key={p.id} className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm">
                    {editingId === p.id ? (
                      <form onSubmit={handleUpdateSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Name</label>
                            <input className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Product Name" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Price (฿)</label>
                            <input className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} placeholder="Price" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Unit</label>
                            <select className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})}>
                              <option>kg</option>
                              <option>g</option>
                              <option>each</option>
                              <option>bunch</option>
                              <option>bag</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Category</label>
                            <select className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                              {categories.map(cat => (
                                <option key={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Description</label>
                          <textarea className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif min-h-[80px]" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} placeholder="Description" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Detailed Description</label>
                          <textarea className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif min-h-[100px]" value={editForm.details} onChange={e => setEditForm({...editForm, details: e.target.value})} placeholder="Detailed description for the expanded product page" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Variations</label>
                            <input className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editForm.variations} onChange={e => setEditForm({...editForm, variations: e.target.value})} placeholder="Red, Green, Mixed" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Portions</label>
                            <input className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editForm.portions} onChange={e => setEditForm({...editForm, portions: e.target.value})} placeholder="250g, 500g, 1kg" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Image URL</label>
                          <input className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editForm.image} onChange={e => setEditForm({...editForm, image: e.target.value})} placeholder="Image URL" />
                        </div>

                        <div className="flex gap-4 pt-2">
                          <button type="submit" className="flex-1 bg-primary text-on-primary py-4 rounded-xl font-bold shadow-lg hover:scale-95 transition-all">Save Changes</button>
                          <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-surface-container-high py-4 rounded-xl font-bold hover:scale-95 transition-all">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center gap-6">
                        <img src={p.image} alt={p.name} className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                        <div className="flex-grow">
                          <h4 className="font-bold text-xl mb-1">{p.name}</h4>
                          <p className="text-sm text-on-surface-variant italic mb-2">฿{p.price.toLocaleString()} / {p.unit}</p>
                          <p className="text-xs text-on-surface-variant line-clamp-2">{p.description}</p>
                          {((p.variations?.length || 0) > 0 || (p.portions?.length || 0) > 0) && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {p.variations?.map(option => (
                                <span key={option} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">{option}</span>
                              ))}
                              {p.portions?.map(option => (
                                <span key={option} className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold">{option}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {confirmDeleteId === p.id ? (
                            <div className="flex flex-col gap-2">
                              <button onClick={() => handleDelete(p.id)} className="px-4 py-2 bg-error text-on-error rounded-xl text-xs font-bold">Confirm Delete</button>
                              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 bg-surface-container-high rounded-xl text-xs font-bold">Cancel</button>
                            </div>
                          ) : (
                            <>
                              <button onClick={() => { 
                                setEditingId(p.id); 
                                setEditForm({ 
                                  name: p.name,
                                  price: p.price.toString(), 
                                  unit: p.unit,
                                  category: p.category,
                                  description: p.description, 
                                  details: p.details || '',
                                  image: p.image,
                                  variations: p.variations?.join(', ') || '',
                                  portions: p.portions?.join(', ') || ''
                                }); 
                              }} className="p-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-all">
                                <Edit2 size={24} />
                              </button>
                              <button onClick={() => setConfirmDeleteId(p.id)} className="p-4 bg-error/10 text-error rounded-2xl hover:bg-error/20 transition-all">
                                <Trash2 size={24} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details & Status Update Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrderId(null)} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-surface rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center text-primary">
                <h2 className="text-2xl font-serif font-black italic">Order {selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrderId(null)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X /></button>
              </div>
              <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto no-scrollbar">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline">Customer</label>
                  <p className="text-2xl font-serif font-bold text-on-surface">{selectedOrder.customerName}</p>
                  <p className="text-sm text-on-surface-variant">{selectedOrder.date}</p>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2 block">Harvest Package</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.items.map((item, idx) => (
                      <span key={idx} className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center bg-surface-container-low p-6 rounded-2xl">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline">Total Paid</label>
                    <p className="text-2xl font-black text-primary">฿{selectedOrder.total.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline">Status</label>
                    <p className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-surface-container-highest`}>
                      {selectedOrder.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline text-center block">Update Fulfillment Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Pending', 'Processing', 'Delivered', 'Completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          updateOrder(selectedOrder.id, { status: status as any });
                        }}
                        className={`py-3 rounded-xl text-xs font-bold uppercase tracking-tight transition-all border-2 ${
                          selectedOrder.status === status 
                          ? 'bg-primary text-on-primary border-primary' 
                          : 'bg-surface hover:bg-surface-container-high border-outline-variant'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View All Orders Modal */}
      <AnimatePresence>
        {isViewAllOrdersOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewAllOrdersOpen(false)} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-surface rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center text-primary">
                <h2 className="text-2xl font-serif font-black italic">All Historical Orders</h2>
                <button onClick={() => setIsViewAllOrdersOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X /></button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-4">
                {orders.map((order, i) => (
                  <div 
                    key={order.id}
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setIsViewAllOrdersOpen(false);
                    }}
                    className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/30 flex justify-between items-center hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-xl text-on-surface">{order.customerName}</p>
                      <p className="text-sm text-on-surface-variant italic">Order {order.id} • ฿{order.total.toLocaleString()} • {order.date}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-surface-container-highest shadow-sm`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUserEmail(null)} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-surface rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center text-secondary">
                <h2 className="text-2xl font-serif font-black italic">Member Profile</h2>
                <button onClick={() => setSelectedUserEmail(null)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X /></button>
              </div>
              <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto no-scrollbar">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-3xl shadow-xl mb-4">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-on-surface">{selectedUser.name}</h3>
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-secondary/10 text-secondary mt-2 shadow-sm">
                    {selectedUser.role}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 bg-surface-container-low p-8 rounded-[2rem]">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline">Email Address</label>
                    <p className="text-lg font-medium text-on-surface">{selectedUser.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline">Phone Number</label>
                    <p className="text-lg font-medium text-on-surface">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline">Membership Since</label>
                    <p className="text-lg font-medium text-on-surface">{selectedUser.joinedDate}</p>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
                  <div className="flex items-center gap-4 text-primary font-bold">
                    <Clock size={24} />
                    <p className="text-sm">Verified Community Member</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Categories Modal */}
      <AnimatePresence>
        {isCategoriesModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCategoriesModalOpen(false)} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-surface rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center text-secondary">
                <div className="flex items-center gap-3">
                  <Tag />
                  <h2 className="text-2xl font-serif font-black italic">Manage Categories</h2>
                </div>
                <button onClick={() => setIsCategoriesModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X /></button>
              </div>
              <div className="p-8 space-y-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (newCategoryName.trim()) {
                    addCategory(newCategoryName.trim());
                    setNewCategoryName('');
                  }
                }} className="flex gap-2">
                  <input 
                    className="flex-1 px-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif" 
                    placeholder="New category name..."
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                  />
                  <button type="submit" className="p-4 bg-secondary text-on-secondary rounded-2xl hover:scale-95 transition-all">
                    <PlusCircle />
                  </button>
                </form>

                <div className="max-h-[40vh] overflow-y-auto no-scrollbar space-y-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                      <span className="font-serif font-bold text-lg">{cat.name}</span>
                      <button 
                        onClick={() => deleteCategory(cat.name)}
                        className="p-2 text-error hover:bg-error/10 rounded-full transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Impact Projects Modal */}
      <AnimatePresence>
        {isImpactModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsImpactModalOpen(false)} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-surface rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center text-tertiary">
                <h2 className="text-2xl font-serif font-black italic">Manage Impact Projects</h2>
                <button onClick={() => setIsImpactModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X /></button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-6">
                {/* Add New Impact Project */}
                <form onSubmit={handleImpactSubmit} className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm space-y-4">
                  <h3 className="font-bold text-lg font-serif">Add New Project</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={newImpactProject.title} onChange={e => setNewImpactProject({...newImpactProject, title: e.target.value})} placeholder="Project Title" />
                    <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={newImpactProject.amount} onChange={e => setNewImpactProject({...newImpactProject, amount: e.target.value})} placeholder="Amount (e.g. $1.2k)" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={newImpactProject.tag} onChange={e => setNewImpactProject({...newImpactProject, tag: e.target.value})} placeholder="Tag (e.g. Education)" />
                    <select className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={newImpactProject.status} onChange={e => setNewImpactProject({...newImpactProject, status: e.target.value as any})}>
                      <option value="Active">Active</option>
                      <option value="Wait">Upcoming</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={newImpactProject.image} onChange={e => setNewImpactProject({...newImpactProject, image: e.target.value})} placeholder="Image URL" />
                  <button type="submit" className="w-full bg-tertiary text-on-tertiary py-3 rounded-xl font-bold shadow-lg hover:scale-[0.98] transition-all">Create Project</button>
                </form>

                <hr className="border-outline-variant/10" />

                {/* List Projects */}
                {impactProjects.map(p => (
                  <div key={p.id} className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm">
                    {editingImpactId === p.id ? (
                      <form onSubmit={handleUpdateImpactSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editImpactForm.title} onChange={e => setEditImpactForm({...editImpactForm, title: e.target.value})} placeholder="Project Title" />
                          <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editImpactForm.amount} onChange={e => setEditImpactForm({...editImpactForm, amount: e.target.value})} placeholder="Amount (e.g. $1.2k)" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editImpactForm.tag} onChange={e => setEditImpactForm({...editImpactForm, tag: e.target.value})} placeholder="Tag (e.g. Education)" />
                          <select className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editImpactForm.status} onChange={e => setEditImpactForm({...editImpactForm, status: e.target.value as any})}>
                            <option value="Active">Active</option>
                            <option value="Wait">Upcoming</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                        <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editImpactForm.image} onChange={e => setEditImpactForm({...editImpactForm, image: e.target.value})} placeholder="Image URL" />
                        <div className="flex gap-4 pt-2">
                          <button type="submit" className="flex-1 bg-tertiary text-on-tertiary py-3 rounded-xl font-bold shadow-lg hover:scale-95 transition-all">Save</button>
                          <button type="button" onClick={() => setEditingImpactId(null)} className="flex-1 bg-surface-container-high py-3 rounded-xl font-bold hover:scale-95 transition-all">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center gap-6">
                        <img src={p.image} alt={p.title} className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-xl">{p.title}</h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-tertiary/10 text-tertiary">{p.status === 'Wait' ? 'Upcoming' : p.status}</span>
                          </div>
                          <p className="text-sm text-on-surface-variant italic mb-2">{p.amount}</p>
                          <span className="text-xs text-on-surface-variant bg-surface px-2 py-1 rounded">{p.tag}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {confirmDeleteId === p.id ? (
                            <div className="flex flex-col gap-2">
                              <button onClick={() => handleDeleteImpact(p.id)} className="px-4 py-2 bg-error text-on-error rounded-xl text-xs font-bold">Confirm Delete</button>
                              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 bg-surface-container-high rounded-xl text-xs font-bold">Cancel</button>
                            </div>
                          ) : (
                            <>
                              <button onClick={() => { 
                                setEditingImpactId(p.id); 
                                setEditImpactForm({ 
                                  title: p.title,
                                  tag: p.tag,
                                  amount: p.amount,
                                  status: p.status,
                                  image: p.image 
                                }); 
                              }} className="p-4 bg-tertiary/10 text-tertiary rounded-2xl hover:bg-tertiary/20 transition-all">
                                <Edit2 size={24} />
                              </button>
                              <button onClick={() => setConfirmDeleteId(p.id)} className="p-4 bg-error/10 text-error rounded-2xl hover:bg-error/20 transition-all">
                                <Trash2 size={24} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Configuration Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPaymentModalOpen(false)} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-surface rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center text-secondary">
                <div className="flex items-center gap-3">
                  <QrCode size={24} />
                  <h2 className="text-2xl font-serif font-black italic">Payment Settings</h2>
                </div>
                <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X /></button>
              </div>
              <div className="p-8 space-y-6">
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">QR Code Image URL</label>
                    <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={paymentForm.qr_image} onChange={e => setPaymentForm({...paymentForm, qr_image: e.target.value})} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Bank Details & Instructions</label>
                    <textarea required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif min-h-[120px]" value={paymentForm.bank_info} onChange={e => setPaymentForm({...paymentForm, bank_info: e.target.value})} placeholder="Bank Name, Account #..." />
                  </div>
                  
                  {/* Preview */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10 flex gap-4 items-center mb-6">
                    {paymentForm.qr_image ? (
                      <img src={paymentForm.qr_image} alt="QR Code" className="w-20 h-20 rounded-xl object-cover bg-surface-container-low" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-surface-container-low flex items-center justify-center text-outline text-[10px] text-center">No Image</div>
                    )}
                    <p className="text-xs text-on-surface flex-1 line-clamp-3 italic leading-relaxed">{paymentForm.bank_info || 'Bank info will appear here'}</p>
                  </div>
                  
                  <button type="submit" className="w-full bg-secondary text-on-secondary py-4 rounded-2xl font-bold shadow-lg hover:scale-[0.98] transition-all text-lg">Save Configuration</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Page Config Modal */}
      <AnimatePresence>
        {isPageConfigModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPageConfigModalOpen(false)} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-surface rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center text-primary">
                <div className="flex items-center gap-3">
                  <Edit2 size={24} />
                  <h2 className="text-2xl font-serif font-black italic">Page Configuration</h2>
                </div>
                <button onClick={() => setIsPageConfigModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X /></button>
              </div>
              <div className="flex px-8 pt-4 gap-4 border-b border-outline-variant/10">
                <button 
                  onClick={() => setActiveConfigTab('main')}
                  className={`pb-4 font-bold text-sm uppercase tracking-widest transition-colors ${activeConfigTab === 'main' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Main Page
                </button>
                <button 
                  onClick={() => setActiveConfigTab('impact')}
                  className={`pb-4 font-bold text-sm uppercase tracking-widest transition-colors ${activeConfigTab === 'impact' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Impact Page
                </button>
              </div>
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                {activeConfigTab === 'main' && (
                  <form onSubmit={handleMarketPageSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Hero Image URL (Main Picture)</label>
                      <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={marketPageForm.hero_image_url} onChange={e => setMarketPageForm({...marketPageForm, hero_image_url: e.target.value})} placeholder="https://..." />
                    </div>
                    {marketPageForm.hero_image_url && (
                      <img src={marketPageForm.hero_image_url} alt="Preview" className="w-full h-48 object-cover rounded-2xl mt-4 bg-surface-container-low" />
                    )}
                    <button type="submit" className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg hover:scale-[0.98] transition-all text-lg">Save Configuration</button>
                  </form>
                )}

                {activeConfigTab === 'impact' && (
                  <form onSubmit={handleImpactPageSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Hero Title</label>
                      <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={impactPageForm.hero_title} onChange={e => setImpactPageForm({...impactPageForm, hero_title: e.target.value})} placeholder="$5,000 Raised..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Hero Description</label>
                      <textarea required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif min-h-[100px]" value={impactPageForm.hero_description} onChange={e => setImpactPageForm({...impactPageForm, hero_description: e.target.value})} placeholder="Together, we've cultivated..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Families Served Metric</label>
                      <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={impactPageForm.families_served} onChange={e => setImpactPageForm({...impactPageForm, families_served: e.target.value})} placeholder="800+" />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Transparency Stats</label>
                      {impactPageForm.transparency_stats.map((stat, i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <input required className="flex-1 px-4 py-3 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={stat.label} onChange={e => {
                            const newStats = [...impactPageForm.transparency_stats];
                            newStats[i].label = e.target.value;
                            setImpactPageForm({...impactPageForm, transparency_stats: newStats});
                          }} placeholder="Label (e.g. Garden Infrastructure)" />
                          <input required type="number" className="w-24 px-4 py-3 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={stat.value} onChange={e => {
                            const newStats = [...impactPageForm.transparency_stats];
                            newStats[i].value = Number(e.target.value) || 0;
                            setImpactPageForm({...impactPageForm, transparency_stats: newStats});
                          }} placeholder="%" />
                        </div>
                      ))}
                    </div>

                    <button type="submit" className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg hover:scale-[0.98] transition-all text-lg">Save Configuration</button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
