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
  EyeOff,
  Copy,
  Ban,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData, type ProductAvailability, type ProductOption } from '../lib/DataContext';
import { useAuth } from '../lib/AuthContext';
import { QrCode } from 'lucide-react';
import { getOrderStatusClasses } from '../lib/orderStatus';
import { buildOrdersCsv } from '../lib/orderExport';

const productAvailabilityActions: {
  value: ProductAvailability;
  label: string;
  icon: typeof Eye;
  classes: string;
}[] = [
  { value: 'visible', label: 'Show Product', icon: Eye, classes: 'bg-emerald-600 text-white hover:bg-emerald-700' },
  { value: 'out_of_stock', label: 'Mark as Out of Stock', icon: Ban, classes: 'bg-red-600 text-white hover:bg-red-700' },
  { value: 'hidden', label: 'Hide Product', icon: EyeOff, classes: 'bg-gray-600 text-white hover:bg-gray-700' }
];

function formatDateOnly(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.split('T')[0] || value;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function loadImageFile(file: File | undefined, onLoad: (dataUrl: string) => void) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') onLoad(reader.result);
  };
  reader.readAsDataURL(file);
}

function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function createProductOption(name: string, price: number): ProductOption {
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `option-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { id, name: name.trim(), price, availability: 'visible' };
}

export default function OperatorDashboard() {
  const {
    products, orders, users, categories, impactProjects, donationProjects, paymentConfig,
    impactPageConfig, donationPageConfig, marketPageConfig, footerPageConfig,
    addProduct, updateProduct, deleteProduct, updateOrder, addCategory, deleteCategory,
    addImpactProject, updateImpactProject, deleteImpactProject,
    addDonationProject, updateDonationProject, deleteDonationProject,
    updatePaymentConfig, updateImpactPageConfig, updateDonationPageConfig,
    updateMarketPageConfig, updateFooterPageConfig
  } = useData();
  const { adminUser, adminPass, updateAdminCredentials } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [activeManagementTab, setActiveManagementTab] = useState<'impact' | 'donation'>('impact');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPageConfigModalOpen, setIsPageConfigModalOpen] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<'main' | 'impact' | 'donation' | 'footer'>('main');
  const [isViewAllOrdersOpen, setIsViewAllOrdersOpen] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const [paymentForm, setPaymentForm] = useState({
    qr_image: '',
    bank_info: ''
  });

  const [marketPageForm, setMarketPageForm] = useState({
    hero_image_url: '',
    hero_images: [''],
    hero_interval_seconds: 5
  });
  const [impactPageForm, setImpactPageForm] = useState({
    hero_title: '',
    hero_description: '',
    showcase_title: '',
    showcase_image: ''
  });
  const [donationPageForm, setDonationPageForm] = useState({
    title: '',
    subtitle: '',
    bottom_title: '',
    tzuchi_link_text: '',
    tzuchi_link_url: '',
    qr_image: '',
    qr_caption: ''
  });
  const [footerPageForm, setFooterPageForm] = useState({
    mission_text: '',
    privacy_text: '',
    terms_text: '',
    instagram: '',
    email: '',
    line: '',
    facebook: ''
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
        showcase_title: impactPageConfig.showcase_title || '',
        showcase_image: impactPageConfig.showcase_image || ''
      });
    }
  }, [impactPageConfig]);

  useEffect(() => {
    if (donationPageConfig) {
      setDonationPageForm({
        title: donationPageConfig.title || '',
        subtitle: donationPageConfig.subtitle || '',
        bottom_title: donationPageConfig.bottom_title || '',
        tzuchi_link_text: donationPageConfig.tzuchi_link_text || '',
        tzuchi_link_url: donationPageConfig.tzuchi_link_url || '',
        qr_image: donationPageConfig.qr_image || '',
        qr_caption: donationPageConfig.qr_caption || ''
      });
    }
  }, [donationPageConfig]);

  useEffect(() => {
    if (marketPageConfig) {
      const configuredImages = marketPageConfig.hero_images?.filter(Boolean) || [];
      setMarketPageForm({
        hero_image_url: configuredImages[0] || marketPageConfig.hero_image_url || '',
        hero_images: configuredImages.length > 0 ? configuredImages : [marketPageConfig.hero_image_url || ''],
        hero_interval_seconds: marketPageConfig.hero_interval_seconds || 5
      });
    }
  }, [marketPageConfig]);

  useEffect(() => {
    if (footerPageConfig) {
      setFooterPageForm({
        mission_text: footerPageConfig.mission_text || '',
        privacy_text: footerPageConfig.privacy_text || '',
        terms_text: footerPageConfig.terms_text || '',
        instagram: footerPageConfig.instagram || '',
        email: footerPageConfig.email || '',
        line: footerPageConfig.line || '',
        facebook: footerPageConfig.facebook || ''
      });
    }
  }, [footerPageConfig]);

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
    options: [] as ProductOption[],
    availability: 'visible' as ProductAvailability
  });
  const [newOptionDraft, setNewOptionDraft] = useState({ name: '', price: '' });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    unit: 'kg',
    category: categories[0]?.name || 'Uncategorized',
    description: '',
    details: '',
    image: '',
    options: [] as ProductOption[]
  });
  const [editOptionDraft, setEditOptionDraft] = useState({ name: '', price: '' });

  const [newImpactProject, setNewImpactProject] = useState({
    title: '',
    amount: '',
    status: 'Wait' as 'Active' | 'Wait' | 'Done',
    status_enabled: true,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb75bb44?auto=format&fit=crop&q=80&w=1000',
    details: ''
  });
  const [editingImpactId, setEditingImpactId] = useState<string | null>(null);
  const [editImpactForm, setEditImpactForm] = useState({
    title: '',
    amount: '',
    status: 'Wait' as 'Active' | 'Wait' | 'Done',
    status_enabled: true,
    image: '',
    details: ''
  });
  const [newDonationProject, setNewDonationProject] = useState({
    title: '',
    date: getTodayInputValue(),
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1000',
    description: '',
    amount: '',
    amount_enabled: false
  });
  const [editingDonationId, setEditingDonationId] = useState<string | null>(null);
  const [editDonationForm, setEditDonationForm] = useState({
    title: '',
    date: '',
    image: '',
    description: '',
    amount: '',
    amount_enabled: false
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

  const addNewProductOption = () => {
    const price = Number(newOptionDraft.price);
    if (!newOptionDraft.name.trim() || !Number.isFinite(price) || price < 0) return;
    setNewProduct(current => ({
      ...current,
      options: [...current.options, createProductOption(newOptionDraft.name, price)]
    }));
    setNewOptionDraft({ name: '', price: '' });
  };

  const removeNewProductOption = (id: string) => {
    setNewProduct(current => ({ ...current, options: current.options.filter(option => option.id !== id) }));
  };

  const addEditProductOption = () => {
    const price = Number(editOptionDraft.price);
    if (!editOptionDraft.name.trim() || !Number.isFinite(price) || price < 0) return;
    setEditForm(current => ({
      ...current,
      options: [...current.options, createProductOption(editOptionDraft.name, price)]
    }));
    setEditOptionDraft({ name: '', price: '' });
  };

  const updateEditProductOption = (id: string, updates: Partial<ProductOption>) => {
    setEditForm(current => ({
      ...current,
      options: current.options.map(option => option.id === id ? { ...option, ...updates } : option)
    }));
  };

  const removeEditProductOption = (id: string) => {
    setEditForm(current => ({ ...current, options: current.options.filter(option => option.id !== id) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      ...newProduct,
      price: parseFloat(newProduct.price) || 0
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
      options: [],
      availability: 'visible'
    });
    setNewOptionDraft({ name: '', price: '' });
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
        options: editForm.options,
        variations: [],
        portions: []
      });
      setEditingId(null);
      setEditOptionDraft({ name: '', price: '' });
    }
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setConfirmDeleteId(null);
    if (editingId === id) setEditingId(null);
  };

  const handleCopyEmail = async (email: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      const copyField = document.createElement('textarea');
      copyField.value = email;
      copyField.style.position = 'fixed';
      copyField.style.opacity = '0';
      document.body.appendChild(copyField);
      copyField.select();
      const copied = document.execCommand('copy');
      copyField.remove();
      if (!copied) return;
    }

    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(current => current === email ? null : current), 1800);
  };

  const closeAllOrders = () => {
    setIsViewAllOrdersOpen(false);
    setSelectedOrderIds([]);
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds(current => current.includes(orderId)
      ? current.filter(id => id !== orderId)
      : [...current, orderId]
    );
  };

  const toggleAllOrders = () => {
    setSelectedOrderIds(current => current.length === orders.length
      ? []
      : orders.map(order => order.id)
    );
  };

  const exportSelectedOrders = () => {
    const selectedOrders = orders.filter(order => selectedOrderIds.includes(order.id));
    if (selectedOrders.length === 0) return;

    const csv = buildOrdersCsv(selectedOrders, users);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `altitude-ally-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    URL.revokeObjectURL(url);
  };

  const handleImpactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addImpactProject(newImpactProject);
    setNewImpactProject({
      title: '',
      amount: '',
      status: 'Wait',
      status_enabled: true,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb75bb44?auto=format&fit=crop&q=80&w=1000',
      details: ''
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

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDonationProject(newDonationProject);
    setNewDonationProject({
      title: '',
      date: getTodayInputValue(),
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1000',
      description: '',
      amount: '',
      amount_enabled: false
    });
  };

  const handleUpdateDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDonationId) {
      updateDonationProject(editingDonationId, editDonationForm);
      setEditingDonationId(null);
    }
  };

  const handleDeleteDonation = (id: string) => {
    deleteDonationProject(id);
    setConfirmDeleteId(null);
    if (editingDonationId === id) setEditingDonationId(null);
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

  const handleDonationPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDonationPageConfig(donationPageForm);
    setIsPageConfigModalOpen(false);
  };

  const handleMarketPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const heroImages = marketPageForm.hero_images.map(image => image.trim()).filter(Boolean);
    if (heroImages.length === 0) return;
    updateMarketPageConfig({
      hero_image_url: heroImages[0],
      hero_images: heroImages,
      hero_interval_seconds: Math.min(60, Math.max(2, Number(marketPageForm.hero_interval_seconds) || 5))
    });
    setIsPageConfigModalOpen(false);
  };

  const updateMarketHeroImage = (index: number, image: string) => {
    setMarketPageForm(current => ({
      ...current,
      hero_images: current.hero_images.map((value, imageIndex) => imageIndex === index ? image : value)
    }));
  };

  const addMarketHeroImage = () => {
    setMarketPageForm(current => ({ ...current, hero_images: [...current.hero_images, ''] }));
  };

  const removeMarketHeroImage = (index: number) => {
    setMarketPageForm(current => {
      const heroImages = current.hero_images.filter((_, imageIndex) => imageIndex !== index);
      return { ...current, hero_images: heroImages.length > 0 ? heroImages : [''] };
    });
  };

  const handleFooterPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFooterPageConfig(footerPageForm);
    setIsPageConfigModalOpen(false);
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const selectedUser = users.find(u => u.email === selectedUserEmail);
  const quickActionButtonClasses = 'min-h-[128px] md:min-h-[150px] p-4 md:p-5 flex flex-col items-start justify-between rounded-2xl md:rounded-3xl shadow-sm hover:scale-[0.98] transition-all';
  const quickActionLabelClasses = 'font-bold text-left text-sm md:text-base leading-snug font-serif uppercase';
  const quickActionIconClasses = 'w-7 h-7 md:w-9 md:h-9';

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-24">
        {/* Welcome Section */}
        <section className="mb-8 md:mb-10 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-on-surface leading-tight font-serif">Operator Console</h1>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 bg-surface-container-high text-primary rounded-xl font-bold text-sm md:text-base hover:bg-primary/10 transition-all shadow-sm group"
          >
            <Home size={20} className="group-hover:-translate-y-0.5 transition-transform" />
            <span>Home</span>
          </Link>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-12 md:mb-16">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className={`${quickActionButtonClasses} bg-primary-container text-on-primary-container group`}
          >
            <PlusCircle className={`${quickActionIconClasses} group-hover:rotate-90 transition-transform`} />
            <span className={quickActionLabelClasses}>Add Product</span>
          </button>
          <button 
            onClick={() => setIsInventoryModalOpen(true)}
            className={`${quickActionButtonClasses} bg-surface-container-high text-on-surface`}
          >
            <Package className={`${quickActionIconClasses} text-primary`} />
            <span className={quickActionLabelClasses}>Inventory</span>
          </button>
          <button 
            onClick={() => setIsCategoriesModalOpen(true)}
            className={`${quickActionButtonClasses} bg-secondary-container text-on-secondary-container`}
          >
            <Tag className={`${quickActionIconClasses} text-secondary`} />
            <span className={quickActionLabelClasses}>Categories</span>
          </button>
          <button 
            onClick={() => setIsImpactModalOpen(true)}
            className={`${quickActionButtonClasses} bg-tertiary-container text-on-tertiary-container group`}
          >
            <Leaf className={`${quickActionIconClasses} group-hover:rotate-12 transition-transform text-tertiary`} />
            <span className={quickActionLabelClasses}>Impact / Donation</span>
          </button>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className={`${quickActionButtonClasses} bg-surface-container-highest text-on-surface group`}
          >
            <QrCode className={`${quickActionIconClasses} text-secondary`} />
            <span className={quickActionLabelClasses}>Payment Setup</span>
          </button>
          <button 
            onClick={() => setIsPageConfigModalOpen(true)}
            className={`${quickActionButtonClasses} bg-surface-container-high text-on-surface group`}
          >
            <Edit2 className={`${quickActionIconClasses} text-primary`} />
            <span className={quickActionLabelClasses}>Page Config</span>
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
                  className="bg-surface-container-low p-5 md:p-6 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-xl text-on-surface">{order.customerName}</p>
                    <p className="text-sm text-on-surface-variant italic">{formatDateOnly(order.date)}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="text-[9px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-stretch md:self-auto">
                    <span className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm md:text-base font-black uppercase text-center border ${getOrderStatusClasses(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="flex-1 md:flex-none px-4 py-2 rounded-lg text-sm md:text-base font-black text-center bg-on-surface text-surface shadow-sm">
                      ฿{order.total.toLocaleString()}
                    </span>
                  </div>
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
                  className="p-5 md:p-6 grid grid-cols-[auto_minmax(0,1fr)] md:grid-cols-[minmax(240px,1.1fr)_minmax(260px,1fr)_auto] items-center gap-4 md:gap-6 hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-base md:text-lg shadow-inner flex-shrink-0">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-lg md:text-xl text-on-surface truncate">{user.name}</p>
                      <span className="text-[10px] uppercase font-extrabold text-secondary tracking-widest">{user.role}</span>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1 min-w-0">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <p className="text-base md:text-lg font-bold text-on-surface break-all">{user.email}</p>
                      <button
                        type="button"
                        title={copiedEmail === user.email ? 'Copied' : 'Copy email'}
                        aria-label={copiedEmail === user.email ? `Copied ${user.email}` : `Copy ${user.email}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleCopyEmail(user.email);
                        }}
                        className="p-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-colors flex-shrink-0"
                      >
                        {copiedEmail === user.email ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1 text-left md:text-right">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Joined</p>
                    <p className="font-bold text-base md:text-lg text-primary whitespace-nowrap">{formatDateOnly(user.joinedDate)}</p>
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Default Price (฿)</label>
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
                    <input
                      required
                      className="block w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif appearance-none"
                      placeholder="e.g. kg, box, tray"
                      value={newProduct.unit}
                      onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                    />
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Short Description</label>
                  <textarea 
                    required
                    className="block w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif min-h-[100px]" 
                    placeholder="Describe the harvest..."
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Long Description</label>
                  <textarea 
                    className="block w-full px-6 py-4 bg-surface-container-low border-none rounded-2xl text-lg font-serif min-h-[120px]" 
                    placeholder="This text opens when the customer presses Details..."
                    value={newProduct.details}
                    onChange={e => setNewProduct({...newProduct, details: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Options (Variations or Portions)</label>
                  <div className="grid grid-cols-[minmax(0,1fr)_100px_46px] md:grid-cols-[minmax(0,1fr)_140px_52px] gap-2 items-end">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-on-surface-variant ml-2">Option name</span>
                      <input className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={newOptionDraft.name} onChange={e => setNewOptionDraft({...newOptionDraft, name: e.target.value})} placeholder="e.g. 500g" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-on-surface-variant ml-2">Price</span>
                      <input type="number" min="0" step="1" className="w-full px-3 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={newOptionDraft.price} onChange={e => setNewOptionDraft({...newOptionDraft, price: e.target.value})} placeholder="0" />
                    </div>
                    <button type="button" onClick={addNewProductOption} disabled={!newOptionDraft.name.trim() || newOptionDraft.price === ''} aria-label="Add product option" className="flex h-11 md:h-12 items-center justify-center rounded-xl bg-primary text-on-primary disabled:opacity-40 hover:bg-primary/90">
                      <PlusCircle size={20} />
                    </button>
                  </div>
                  {newProduct.options.length > 0 && (
                    <div className="space-y-2">
                      {newProduct.options.map(option => (
                        <div key={option.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low px-4 py-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-on-surface">{option.name}</p>
                            <p className="text-xs font-bold text-primary">{'\u0E3F'}{option.price.toLocaleString()}</p>
                          </div>
                          <button type="button" onClick={() => removeNewProductOption(option.id)} aria-label={`Remove ${option.name}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 hover:bg-red-200">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-on-surface-variant ml-2">Add one option and its price at a time. Products without options use the default market price.</p>
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
              <div className="p-4 md:p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-6">
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
                            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Default Price (฿)</label>
                            <input className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} placeholder="Price" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Unit</label>
                            <input className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})} placeholder="e.g. kg, box, tray" />
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
                          <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Short Description</label>
                          <textarea className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif min-h-[80px]" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} placeholder="Description" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Long Description</label>
                          <textarea className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif min-h-[100px]" value={editForm.details} onChange={e => setEditForm({...editForm, details: e.target.value})} placeholder="Text shown after the customer presses Details" />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-2">Options (Variations or Portions)</label>
                          {editForm.options.map(option => (
                            <div key={option.id} className="space-y-3 rounded-xl border border-outline-variant/15 bg-surface-container-low p-3">
                              <div className="grid grid-cols-[minmax(0,1fr)_100px_40px] gap-2">
                                <input className="min-w-0 px-3 py-2.5 bg-surface-container-lowest border-none rounded-lg text-sm font-serif" value={option.name} onChange={e => updateEditProductOption(option.id, { name: e.target.value })} aria-label={`Option name for ${option.name}`} />
                                <input type="number" min="0" step="1" className="w-full px-3 py-2.5 bg-surface-container-lowest border-none rounded-lg text-sm font-serif" value={option.price} onChange={e => updateEditProductOption(option.id, { price: Number(e.target.value) || 0 })} aria-label={`Price for ${option.name}`} />
                                <button type="button" onClick={() => removeEditProductOption(option.id)} aria-label={`Delete ${option.name} option`} className="flex items-center justify-center rounded-lg bg-red-100 text-red-700 hover:bg-red-200"><Trash2 size={16} /></button>
                              </div>
                              <div className="grid grid-cols-3 gap-1.5">
                                {productAvailabilityActions.map(action => {
                                  const isActive = option.availability === action.value;
                                  return (
                                    <button key={action.value} type="button" aria-pressed={isActive} onClick={() => updateEditProductOption(option.id, { availability: action.value })} className={`min-h-9 rounded-lg px-1.5 py-2 text-[9px] font-black leading-tight transition-all ${action.classes} ${isActive ? 'ring-2 ring-on-surface/25 ring-offset-1 ring-offset-surface-container-low' : 'opacity-65 hover:opacity-100'}`}>
                                      {action.value === 'visible' ? 'Shown' : action.value === 'out_of_stock' ? 'Out of Stock' : 'Hidden'}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          <div className="grid grid-cols-[minmax(0,1fr)_100px_42px] gap-2 items-end">
                            <input className="min-w-0 px-3 py-2.5 bg-surface-container-low border-none rounded-lg text-sm font-serif" value={editOptionDraft.name} onChange={e => setEditOptionDraft({...editOptionDraft, name: e.target.value})} placeholder="New option" />
                            <input type="number" min="0" step="1" className="w-full px-3 py-2.5 bg-surface-container-low border-none rounded-lg text-sm font-serif" value={editOptionDraft.price} onChange={e => setEditOptionDraft({...editOptionDraft, price: e.target.value})} placeholder="Price" />
                            <button type="button" onClick={addEditProductOption} disabled={!editOptionDraft.name.trim() || editOptionDraft.price === ''} aria-label="Add inventory option" className="flex h-10 items-center justify-center rounded-lg bg-primary text-on-primary disabled:opacity-40"><PlusCircle size={18} /></button>
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
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
                        <img src={p.image} alt={p.name} className="w-full sm:w-24 h-40 sm:h-24 rounded-2xl object-cover shadow-md" />
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-bold text-xl">{p.name}</h4>
                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${p.availability === 'visible' ? 'bg-emerald-100 text-emerald-800' : p.availability === 'out_of_stock' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'}`}>
                              {p.availability === 'visible' ? 'Shown' : p.availability === 'out_of_stock' ? 'Out of Stock' : 'Hidden'}
                            </span>
                          </div>
                          <p className="text-sm text-on-surface-variant italic mb-2">฿{p.price.toLocaleString()} / {p.unit}</p>
                          <p className="text-xs text-on-surface-variant line-clamp-2">{p.description}</p>
                          {(p.options?.length || 0) > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3">
                              {p.options?.map(option => (
                                <div key={option.id} className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[10px] font-bold ${option.availability === 'visible' ? 'bg-emerald-50 text-emerald-800' : option.availability === 'out_of_stock' ? 'bg-red-50 text-red-800' : 'bg-gray-100 text-gray-700'}`}>
                                  <span className="truncate">{option.name}</span>
                                  <span className="shrink-0">{'\u0E3F'}{option.price.toLocaleString()} | {option.availability === 'visible' ? 'Shown' : option.availability === 'out_of_stock' ? 'Out' : 'Hidden'}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex sm:flex-col gap-2">
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
                                  options: p.options || []
                                }); 
                                setEditOptionDraft({ name: '', price: '' });
                              }} title="Edit product" aria-label={`Edit ${p.name}`} className="p-3 md:p-4 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all">
                                <Edit2 size={24} />
                              </button>
                              <button onClick={() => setConfirmDeleteId(p.id)} title="Delete product" aria-label={`Delete ${p.name}`} className="p-3 md:p-4 bg-error/10 text-error rounded-xl hover:bg-error/20 transition-all">
                                <Trash2 size={24} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="mt-5 pt-5 border-t border-outline-variant/15">
                      <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-3">Store Status</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {productAvailabilityActions.map((action) => {
                          const StatusIcon = action.icon;
                          const isActive = p.availability === action.value;
                          return (
                            <button
                              key={action.value}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() => updateProduct(p.id, { availability: action.value })}
                              className={`min-h-11 px-3 py-2.5 rounded-lg text-[11px] md:text-xs font-black flex items-center justify-center gap-2 transition-all ${action.classes} ${isActive ? 'ring-2 ring-on-surface/30 ring-offset-2 ring-offset-surface-container-lowest' : 'opacity-80 hover:opacity-100'}`}
                            >
                              {isActive ? <Check size={16} /> : <StatusIcon size={16} />}
                              <span>{action.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
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
                <h2 className="text-2xl font-serif font-black italic">Order Details</h2>
                <button onClick={() => setSelectedOrderId(null)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X /></button>
              </div>
              <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto no-scrollbar">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline">Customer</label>
                  <p className="text-2xl font-serif font-bold text-on-surface">{selectedOrder.customerName}</p>
                  <p className="text-sm text-on-surface-variant">{formatDateOnly(selectedOrder.date)}</p>
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
                    <p className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase border ${getOrderStatusClasses(selectedOrder.status)}`}>
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
                        className={`py-3 rounded-xl text-xs font-bold uppercase transition-all border-2 ${
                          selectedOrder.status === status 
                          ? getOrderStatusClasses(status)
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAllOrders} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-surface rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center text-primary">
                <h2 className="text-2xl font-serif font-black italic">All Historical Orders</h2>
                <button onClick={closeAllOrders} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X /></button>
              </div>
              <div className="flex flex-col gap-4 border-b border-outline-variant/10 bg-surface-container-low px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
                <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 font-bold text-on-surface">
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                    onChange={toggleAllOrders}
                    disabled={orders.length === 0}
                    className="h-5 w-5 accent-primary"
                  />
                  <span>Select all</span>
                  <span className="text-sm font-medium text-on-surface-variant">{selectedOrderIds.length} selected</span>
                </label>
                <button
                  type="button"
                  onClick={exportSelectedOrders}
                  disabled={selectedOrderIds.length === 0}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download size={18} />
                  Export as CSV
                </button>
              </div>
              <div className="p-5 md:p-8 max-h-[62vh] overflow-y-auto no-scrollbar space-y-4">
                {orders.map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      closeAllOrders();
                    }}
                    className="bg-surface-container-low p-5 md:p-6 rounded-2xl border border-outline-variant/30 grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.includes(order.id)}
                      onClick={event => event.stopPropagation()}
                      onChange={() => toggleOrderSelection(order.id)}
                      aria-label={`Select order from ${order.customerName}`}
                      className="h-5 w-5 accent-primary"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xl text-on-surface">{order.customerName}</p>
                      <p className="text-sm text-on-surface-variant italic">{formatDateOnly(order.date)}</p>
                      <p className="mt-1 truncate text-xs text-on-surface-variant">{order.items.join(' | ')}</p>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                      <span className={`flex-1 px-4 py-2 rounded-lg text-sm font-black uppercase text-center border ${getOrderStatusClasses(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="flex-1 px-4 py-2 rounded-lg text-sm font-black text-center bg-on-surface text-surface">
                        ฿{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-outline-variant/40 p-10 text-center text-on-surface-variant">
                    No orders are available to export.
                  </div>
                )}
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
                    <div className="flex items-center gap-2">
                      <p className="text-xl md:text-2xl font-bold text-on-surface break-all">{selectedUser.email}</p>
                      <button
                        type="button"
                        title={copiedEmail === selectedUser.email ? 'Copied' : 'Copy email'}
                        aria-label={copiedEmail === selectedUser.email ? `Copied ${selectedUser.email}` : `Copy ${selectedUser.email}`}
                        onClick={() => handleCopyEmail(selectedUser.email)}
                        className="p-3 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-colors flex-shrink-0"
                      >
                        {copiedEmail === selectedUser.email ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline">Phone Number</label>
                    <p className="text-lg font-medium text-on-surface">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline">Membership Since</label>
                    <p className="text-lg font-medium text-on-surface">{formatDateOnly(selectedUser.joinedDate)}</p>
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

      {/* Impact and Donation Management Modal */}
      <AnimatePresence>
        {isImpactModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsImpactModalOpen(false)} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-surface rounded-[3rem] shadow-2xl overflow-hidden border border-outline-variant/20">
              <div className="p-6 md:p-8 border-b border-outline-variant/10 flex justify-between items-center text-tertiary">
                <h2 className="text-xl md:text-2xl font-serif font-black italic">Impact &amp; Donation Management</h2>
                <button onClick={() => setIsImpactModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X /></button>
              </div>
              <div className="flex border-b border-outline-variant/10 px-6 md:px-8">
                <button
                  type="button"
                  onClick={() => setActiveManagementTab('impact')}
                  className={`min-h-12 flex-1 border-b-2 px-4 text-sm font-bold transition-colors ${activeManagementTab === 'impact' ? 'border-tertiary text-tertiary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                >
                  Impact
                </button>
                <button
                  type="button"
                  onClick={() => setActiveManagementTab('donation')}
                  className={`min-h-12 flex-1 border-b-2 px-4 text-sm font-bold transition-colors ${activeManagementTab === 'donation' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                >
                  Donation
                </button>
              </div>
              {activeManagementTab === 'impact' && (
              <div className="p-5 md:p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-6">
                {/* Add New Impact Item */}
                <form onSubmit={handleImpactSubmit} className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm space-y-4">
                  <h3 className="font-bold text-lg font-serif">Add Impact Project</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={newImpactProject.title} onChange={e => setNewImpactProject({...newImpactProject, title: e.target.value})} placeholder="Project Title" />
                    <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={newImpactProject.amount} onChange={e => setNewImpactProject({...newImpactProject, amount: e.target.value})} placeholder="Amount (e.g. $1.2k)" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_1fr] md:items-center">
                    <button
                      type="button"
                      aria-pressed={newImpactProject.status_enabled}
                      onClick={() => setNewImpactProject({...newImpactProject, status_enabled: !newImpactProject.status_enabled})}
                      className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors ${newImpactProject.status_enabled ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}
                    >
                      {newImpactProject.status_enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                      Status {newImpactProject.status_enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <select disabled={!newImpactProject.status_enabled} className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif disabled:cursor-not-allowed disabled:opacity-45" value={newImpactProject.status} onChange={e => setNewImpactProject({...newImpactProject, status: e.target.value as any})}>
                      <option value="Active">Active</option>
                      <option value="Wait">Upcoming</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={newImpactProject.image} onChange={e => setNewImpactProject({...newImpactProject, image: e.target.value})} placeholder="Image URL" />
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm font-bold text-primary hover:bg-surface-container-highest">
                    <ImageIcon size={18} />
                    Upload Photo
                    <input type="file" accept="image/*" className="sr-only" onChange={e => loadImageFile(e.target.files?.[0], image => setNewImpactProject({...newImpactProject, image}))} />
                  </label>
                  <textarea required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif min-h-[140px]" value={newImpactProject.details} onChange={e => setNewImpactProject({...newImpactProject, details: e.target.value})} placeholder="Detailed impact project text" />
                  <button type="submit" className="w-full bg-tertiary text-on-tertiary py-3 rounded-xl font-bold shadow-lg hover:scale-[0.98] transition-all">Create Project</button>
                </form>

                <hr className="border-outline-variant/10" />

                {/* List Projects */}
                {impactProjects.map(p => (
                  <div key={p.id} className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm">
                    {editingImpactId === p.id ? (
                      <form onSubmit={handleUpdateImpactSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editImpactForm.title} onChange={e => setEditImpactForm({...editImpactForm, title: e.target.value})} placeholder="Project Title" />
                          <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editImpactForm.amount} onChange={e => setEditImpactForm({...editImpactForm, amount: e.target.value})} placeholder="Amount (e.g. $1.2k)" />
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_1fr] md:items-center">
                          <button
                            type="button"
                            aria-pressed={editImpactForm.status_enabled}
                            onClick={() => setEditImpactForm({...editImpactForm, status_enabled: !editImpactForm.status_enabled})}
                            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors ${editImpactForm.status_enabled ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}
                          >
                            {editImpactForm.status_enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                            Status {editImpactForm.status_enabled ? 'Enabled' : 'Disabled'}
                          </button>
                          <select disabled={!editImpactForm.status_enabled} className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif disabled:cursor-not-allowed disabled:opacity-45" value={editImpactForm.status} onChange={e => setEditImpactForm({...editImpactForm, status: e.target.value as any})}>
                            <option value="Active">Active</option>
                            <option value="Wait">Upcoming</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                        <input required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif" value={editImpactForm.image} onChange={e => setEditImpactForm({...editImpactForm, image: e.target.value})} placeholder="Image URL" />
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm font-bold text-primary hover:bg-surface-container-highest">
                          <ImageIcon size={18} />
                          Upload Photo
                          <input type="file" accept="image/*" className="sr-only" onChange={e => loadImageFile(e.target.files?.[0], image => setEditImpactForm({...editImpactForm, image}))} />
                        </label>
                        <textarea required className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-serif min-h-[140px]" value={editImpactForm.details} onChange={e => setEditImpactForm({...editImpactForm, details: e.target.value})} placeholder="Detailed impact project text" />
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
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${p.status_enabled ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                              {p.status_enabled ? (p.status === 'Wait' ? 'Upcoming' : p.status) : 'Status hidden'}
                            </span>
                          </div>
                          <p className="text-sm text-on-surface-variant italic mb-2">{p.amount}</p>
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
                                  amount: p.amount,
                                  status: p.status,
                                  status_enabled: p.status_enabled,
                                  image: p.image,
                                  details: p.details || ''
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
              )}

              {activeManagementTab === 'donation' && (
                <div className="p-5 md:p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-6">
                  <form onSubmit={handleDonationSubmit} className="space-y-4 rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest p-5 md:p-6 shadow-sm">
                    <h3 className="font-serif text-lg font-bold">Add Donation Project</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <input required className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-serif" value={newDonationProject.title} onChange={e => setNewDonationProject({...newDonationProject, title: e.target.value})} placeholder="Project Title" />
                      <input required type="date" aria-label="Project date" className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-serif" value={newDonationProject.date} onChange={e => setNewDonationProject({...newDonationProject, date: e.target.value})} />
                    </div>
                    <input required className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-serif" value={newDonationProject.image} onChange={e => setNewDonationProject({...newDonationProject, image: e.target.value})} placeholder="Image URL" />
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm font-bold text-primary hover:bg-surface-container-highest">
                      <ImageIcon size={18} />
                      Upload Photo
                      <input type="file" accept="image/*" className="sr-only" onChange={e => loadImageFile(e.target.files?.[0], image => setNewDonationProject({...newDonationProject, image}))} />
                    </label>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_1fr] md:items-center">
                      <button
                        type="button"
                        aria-pressed={newDonationProject.amount_enabled}
                        onClick={() => setNewDonationProject({...newDonationProject, amount_enabled: !newDonationProject.amount_enabled})}
                        className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors ${newDonationProject.amount_enabled ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}
                      >
                        {newDonationProject.amount_enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                        Amount {newDonationProject.amount_enabled ? 'Enabled' : 'Disabled'}
                      </button>
                      <input disabled={!newDonationProject.amount_enabled} className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-serif disabled:cursor-not-allowed disabled:opacity-45" value={newDonationProject.amount} onChange={e => setNewDonationProject({...newDonationProject, amount: e.target.value})} placeholder="Amount (optional)" />
                    </div>
                    <textarea required className="min-h-[150px] w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-serif" value={newDonationProject.description} onChange={e => setNewDonationProject({...newDonationProject, description: e.target.value})} placeholder="Donation project description" />
                    <button type="submit" className="w-full rounded-xl bg-primary py-3 font-bold text-on-primary shadow-lg transition-all hover:scale-[0.98]">Create Donation Project</button>
                  </form>

                  <hr className="border-outline-variant/10" />

                  {donationProjects.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-outline-variant/30 px-6 py-10 text-center text-sm text-on-surface-variant">
                      No donation projects yet.
                    </div>
                  )}

                  {donationProjects.map(project => (
                    <div key={project.id} className="rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest p-5 md:p-6 shadow-sm">
                      {editingDonationId === project.id ? (
                        <form onSubmit={handleUpdateDonationSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input required className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-serif" value={editDonationForm.title} onChange={e => setEditDonationForm({...editDonationForm, title: e.target.value})} placeholder="Project Title" />
                            <input required type="date" aria-label="Project date" className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-serif" value={editDonationForm.date} onChange={e => setEditDonationForm({...editDonationForm, date: e.target.value})} />
                          </div>
                          <input required className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-serif" value={editDonationForm.image} onChange={e => setEditDonationForm({...editDonationForm, image: e.target.value})} placeholder="Image URL" />
                          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm font-bold text-primary hover:bg-surface-container-highest">
                            <ImageIcon size={18} />
                            Upload Photo
                            <input type="file" accept="image/*" className="sr-only" onChange={e => loadImageFile(e.target.files?.[0], image => setEditDonationForm({...editDonationForm, image}))} />
                          </label>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_1fr] md:items-center">
                            <button
                              type="button"
                              aria-pressed={editDonationForm.amount_enabled}
                              onClick={() => setEditDonationForm({...editDonationForm, amount_enabled: !editDonationForm.amount_enabled})}
                              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors ${editDonationForm.amount_enabled ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}
                            >
                              {editDonationForm.amount_enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                              Amount {editDonationForm.amount_enabled ? 'Enabled' : 'Disabled'}
                            </button>
                            <input disabled={!editDonationForm.amount_enabled} className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-serif disabled:cursor-not-allowed disabled:opacity-45" value={editDonationForm.amount} onChange={e => setEditDonationForm({...editDonationForm, amount: e.target.value})} placeholder="Amount (optional)" />
                          </div>
                          <textarea required className="min-h-[150px] w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-serif" value={editDonationForm.description} onChange={e => setEditDonationForm({...editDonationForm, description: e.target.value})} placeholder="Donation project description" />
                          <div className="flex gap-3 pt-2">
                            <button type="submit" className="flex-1 rounded-xl bg-primary py-3 font-bold text-on-primary shadow-lg transition-all hover:scale-95">Save</button>
                            <button type="button" onClick={() => setEditingDonationId(null)} className="flex-1 rounded-xl bg-surface-container-high py-3 font-bold transition-all hover:scale-95">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          <img src={project.image} alt={project.title} className="h-36 w-full rounded-2xl object-cover shadow-md sm:h-24 sm:w-24" />
                          <div className="min-w-0 flex-grow">
                            <h4 className="break-words text-lg font-bold md:text-xl">{project.title}</h4>
                            <p className="mt-1 text-sm text-on-surface-variant">{formatDateOnly(project.date)}</p>
                            <p className="mt-1 text-sm font-bold text-primary">{project.amount_enabled && project.amount ? project.amount : 'Amount hidden'}</p>
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">{project.description}</p>
                          </div>
                          <div className="flex shrink-0 gap-2 sm:flex-col">
                            {confirmDeleteId === project.id ? (
                              <>
                                <button onClick={() => handleDeleteDonation(project.id)} className="px-4 py-2 bg-error text-on-error rounded-xl text-xs font-bold">Confirm Delete</button>
                                <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 bg-surface-container-high rounded-xl text-xs font-bold">Cancel</button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  aria-label={`Edit ${project.title}`}
                                  onClick={() => {
                                    setEditingDonationId(project.id);
                                    setEditDonationForm({
                                      title: project.title,
                                      date: project.date,
                                      image: project.image,
                                      description: project.description,
                                      amount: project.amount,
                                      amount_enabled: project.amount_enabled
                                    });
                                  }}
                                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20"
                                >
                                  <Edit2 size={21} />
                                </button>
                                <button type="button" aria-label={`Delete ${project.title}`} onClick={() => setConfirmDeleteId(project.id)} className="flex h-12 w-12 items-center justify-center rounded-xl bg-error/10 text-error hover:bg-error/20">
                                  <Trash2 size={21} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
              <div className="flex overflow-x-auto px-8 pt-4 gap-5 border-b border-outline-variant/10 no-scrollbar">
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
                <button
                  onClick={() => setActiveConfigTab('donation')}
                  className={`shrink-0 pb-4 font-bold text-sm uppercase tracking-widest whitespace-nowrap transition-colors ${activeConfigTab === 'donation' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Donation Page
                </button>
                <button
                  onClick={() => setActiveConfigTab('footer')}
                  className={`pb-4 font-bold text-sm uppercase tracking-widest whitespace-nowrap transition-colors ${activeConfigTab === 'footer' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Footer
                </button>
              </div>
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                {activeConfigTab === 'main' && (
                  <form onSubmit={handleMarketPageSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Carousel Photos</label>
                      <div className="space-y-4">
                        {marketPageForm.hero_images.map((image, index) => (
                          <div key={index} className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-3 space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                required={index === 0}
                                className="min-w-0 flex-1 px-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm font-serif"
                                value={image}
                                onChange={e => updateMarketHeroImage(index, e.target.value)}
                                placeholder="Image URL"
                              />
                              <button
                                type="button"
                                onClick={() => removeMarketHeroImage(index)}
                                aria-label={`Remove carousel photo ${index + 1}`}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 hover:bg-red-200"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-surface-container-high px-4 py-3 text-sm font-bold text-primary hover:bg-surface-container-highest">
                              <ImageIcon size={18} />
                              Upload Photo {index + 1}
                              <input type="file" accept="image/*" className="sr-only" onChange={e => loadImageFile(e.target.files?.[0], value => updateMarketHeroImage(index, value))} />
                            </label>
                            {image && <img src={image} alt={`Carousel preview ${index + 1}`} className="h-28 w-full rounded-xl object-cover bg-surface-container-high" />}
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addMarketHeroImage} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 px-4 py-3 text-sm font-bold text-primary hover:bg-primary/5">
                        <PlusCircle size={18} />
                        Add Another Photo
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Seconds Between Photos</label>
                      <input
                        type="number"
                        min="2"
                        max="60"
                        required
                        className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif"
                        value={marketPageForm.hero_interval_seconds}
                        onChange={e => setMarketPageForm({...marketPageForm, hero_interval_seconds: Number(e.target.value)})}
                      />
                    </div>
                    <button type="submit" className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg hover:scale-[0.98] transition-all text-lg">Save Configuration</button>
                  </form>
                )}

                {activeConfigTab === 'impact' && (
                  <form onSubmit={handleImpactPageSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Page Title</label>
                      <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={impactPageForm.hero_title} onChange={e => setImpactPageForm({...impactPageForm, hero_title: e.target.value})} placeholder="Placeholder" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Page Subheading</label>
                      <textarea required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif min-h-[100px]" value={impactPageForm.hero_description} onChange={e => setImpactPageForm({...impactPageForm, hero_description: e.target.value})} placeholder="Placeholder" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Wide Image Heading</label>
                      <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={impactPageForm.showcase_title} onChange={e => setImpactPageForm({...impactPageForm, showcase_title: e.target.value})} placeholder="Placeholder" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Wide Image</label>
                      <input className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={impactPageForm.showcase_image} onChange={e => setImpactPageForm({...impactPageForm, showcase_image: e.target.value})} placeholder="Image URL" />
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm font-bold text-primary hover:bg-surface-container-highest">
                        <ImageIcon size={18} />
                        Upload Wide Image
                        <input type="file" accept="image/*" className="sr-only" onChange={e => loadImageFile(e.target.files?.[0], showcase_image => setImpactPageForm({...impactPageForm, showcase_image}))} />
                      </label>
                    </div>
                    {impactPageForm.showcase_image && (
                      <img src={impactPageForm.showcase_image} alt="Impact wide image preview" className="h-auto w-full rounded-2xl bg-surface-container-low" />
                    )}

                    <button type="submit" className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg hover:scale-[0.98] transition-all text-lg">Save Impact Page</button>
                  </form>
                )}

                {activeConfigTab === 'donation' && (
                  <form onSubmit={handleDonationPageSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Page Title</label>
                      <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={donationPageForm.title} onChange={e => setDonationPageForm({...donationPageForm, title: e.target.value})} placeholder="Placeholder" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Page Subheading</label>
                      <textarea required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif min-h-[90px]" value={donationPageForm.subtitle} onChange={e => setDonationPageForm({...donationPageForm, subtitle: e.target.value})} placeholder="Placeholder" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Bottom Subtitle</label>
                      <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={donationPageForm.bottom_title} onChange={e => setDonationPageForm({...donationPageForm, bottom_title: e.target.value})} placeholder="Placeholder" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Tzu Chi Link Text</label>
                        <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={donationPageForm.tzuchi_link_text} onChange={e => setDonationPageForm({...donationPageForm, tzuchi_link_text: e.target.value})} placeholder="Placeholder" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Tzu Chi URL</label>
                        <input required type="url" className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={donationPageForm.tzuchi_link_url} onChange={e => setDonationPageForm({...donationPageForm, tzuchi_link_url: e.target.value})} placeholder="https://..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Direct Donation QR Image</label>
                      <input className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={donationPageForm.qr_image} onChange={e => setDonationPageForm({...donationPageForm, qr_image: e.target.value})} placeholder="Image URL" />
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm font-bold text-primary hover:bg-surface-container-highest">
                        <ImageIcon size={18} />
                        Upload QR Image
                        <input type="file" accept="image/*" className="sr-only" onChange={e => loadImageFile(e.target.files?.[0], qr_image => setDonationPageForm({...donationPageForm, qr_image}))} />
                      </label>
                    </div>
                    {donationPageForm.qr_image && (
                      <img src={donationPageForm.qr_image} alt="Donation QR preview" className="mx-auto aspect-square w-48 rounded-2xl bg-white object-contain p-3" />
                    )}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">QR Caption</label>
                      <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={donationPageForm.qr_caption} onChange={e => setDonationPageForm({...donationPageForm, qr_caption: e.target.value})} placeholder="Placeholder" />
                    </div>
                    <button type="submit" className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg hover:scale-[0.98] transition-all text-lg">Save Donation Page</button>
                  </form>
                )}

                {activeConfigTab === 'footer' && (
                  <form onSubmit={handleFooterPageSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Our Mission Text</label>
                      <textarea required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif min-h-[110px]" value={footerPageForm.mission_text} onChange={e => setFooterPageForm({...footerPageForm, mission_text: e.target.value})} placeholder="Our mission content will be added here." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Privacy Text</label>
                      <textarea required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif min-h-[110px]" value={footerPageForm.privacy_text} onChange={e => setFooterPageForm({...footerPageForm, privacy_text: e.target.value})} placeholder="Our privacy policy will be added here." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-2">Terms Text</label>
                      <textarea required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif min-h-[110px]" value={footerPageForm.terms_text} onChange={e => setFooterPageForm({...footerPageForm, terms_text: e.target.value})} placeholder="Our terms and conditions will be added here." />
                    </div>

                    <div className="border-t border-outline-variant/15 pt-6">
                      <h3 className="mb-4 font-serif text-lg font-bold">Contact Us</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={footerPageForm.instagram} onChange={e => setFooterPageForm({...footerPageForm, instagram: e.target.value})} placeholder="Instagram" aria-label="Instagram contact" />
                        <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={footerPageForm.email} onChange={e => setFooterPageForm({...footerPageForm, email: e.target.value})} placeholder="Email" aria-label="Email contact" />
                        <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={footerPageForm.line} onChange={e => setFooterPageForm({...footerPageForm, line: e.target.value})} placeholder="LINE" aria-label="LINE contact" />
                        <input required className="w-full px-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm font-serif" value={footerPageForm.facebook} onChange={e => setFooterPageForm({...footerPageForm, facebook: e.target.value})} placeholder="Facebook" aria-label="Facebook contact" />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg hover:scale-[0.98] transition-all text-lg">Save Footer Configuration</button>
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
