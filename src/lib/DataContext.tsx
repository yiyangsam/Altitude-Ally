import React, { createContext, useContext, useState, useEffect } from 'react';

export type ProductAvailability = 'visible' | 'out_of_stock' | 'hidden';

export interface ProductOption {
  id: string;
  name: string;
  price: number;
  availability: ProductAvailability;
}

export interface Product {
  id: string; // Postgres UUID
  name: string;
  price: number;
  unit: string;
  description: string;
  details?: string;
  category: string;
  image: string;
  variations?: string[];
  portions?: string[];
  options?: ProductOption[];
  availability: ProductAvailability;
}

export interface Order {
  id: string;
  user_id?: string;
  customerName: string;
  date: string;
  total: number;
  items: string[];
  status: 'Pending' | 'Delivered' | 'Processing' | 'Completed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'Customer' | 'Volunteer' | 'Donor';
  joinedDate: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ImpactProject {
  id: string;
  title: string;
  amount: string;
  status: 'Active' | 'Wait' | 'Done';
  status_enabled: boolean;
  image: string;
  details: string;
}

export interface DonationProject {
  id: string;
  title: string;
  date: string;
  image: string;
  description: string;
  amount: string;
  amount_enabled: boolean;
}

export interface PaymentConfig {
  qr_image: string;
  bank_info: string;
}

export interface ImpactPageConfig {
  hero_title: string;
  hero_description: string;
  showcase_title: string;
  showcase_image: string;
}

export interface DonationPageConfig {
  title: string;
  subtitle: string;
  bottom_title: string;
  tzuchi_link_text: string;
  tzuchi_link_url: string;
  qr_image: string;
  qr_caption: string;
}

export interface MarketPageConfig {
  hero_image_url: string;
  hero_images: string[];
  hero_interval_seconds: number;
}

export interface FooterPageConfig {
  mission_text: string;
  privacy_text: string;
  terms_text: string;
  instagram: string;
  email: string;
  line: string;
  facebook: string;
}

interface DataContextType {
  products: Product[];
  orders: Order[];
  users: User[];
  categories: Category[];
  impactProjects: ImpactProject[];
  donationProjects: DonationProject[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<Order>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  deleteCategory: (name: string) => Promise<void>;
  addImpactProject: (project: Omit<ImpactProject, 'id'>) => Promise<void>;
  updateImpactProject: (id: string, updates: Partial<ImpactProject>) => Promise<void>;
  deleteImpactProject: (id: string) => Promise<void>;
  addDonationProject: (project: Omit<DonationProject, 'id'>) => Promise<void>;
  updateDonationProject: (id: string, updates: Partial<DonationProject>) => Promise<void>;
  deleteDonationProject: (id: string) => Promise<void>;
  paymentConfig: PaymentConfig | null;
  updatePaymentConfig: (config: PaymentConfig) => Promise<void>;
  impactPageConfig: ImpactPageConfig | null;
  updateImpactPageConfig: (config: ImpactPageConfig) => Promise<void>;
  donationPageConfig: DonationPageConfig | null;
  updateDonationPageConfig: (config: DonationPageConfig) => Promise<void>;
  marketPageConfig: MarketPageConfig | null;
  updateMarketPageConfig: (config: MarketPageConfig) => Promise<void>;
  footerPageConfig: FooterPageConfig | null;
  updateFooterPageConfig: (config: FooterPageConfig) => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function isStructuredProductOption(value: unknown): value is Partial<ProductOption> & { name: string } {
  return Boolean(value && typeof value === 'object' && typeof (value as { name?: unknown }).name === 'string');
}

function normalizeProductOptions(product: Product): ProductOption[] {
  const rawVariations = Array.isArray(product.variations) ? product.variations as unknown[] : [];
  const structuredOptions = rawVariations.filter(isStructuredProductOption);

  if (structuredOptions.length > 0) {
    return structuredOptions.map((option, index): ProductOption => {
      const availability: ProductAvailability = option.availability === 'out_of_stock' || option.availability === 'hidden'
        ? option.availability
        : 'visible';
      return {
        id: typeof option.id === 'string' && option.id ? option.id : `option-${product.id}-${index}`,
        name: option.name.trim(),
        price: Number.isFinite(Number(option.price)) ? Number(option.price) : Number(product.price) || 0,
        availability
      };
    }).filter(option => option.name.length > 0);
  }

  const variationNames = rawVariations.filter((option): option is string => typeof option === 'string' && option.trim().length > 0);
  const portionNames = Array.isArray(product.portions)
    ? (product.portions as unknown[]).filter((option): option is string => typeof option === 'string' && option.trim().length > 0)
    : [];
  const legacyCombinations = variationNames.length > 0 && portionNames.length > 0
    ? variationNames.flatMap(variation => portionNames.map(portion => ({ id: `${variation}-${portion}`, name: `${variation} - ${portion}` })))
    : (variationNames.length > 0 ? variationNames : portionNames).map(name => ({ id: name, name }));

  return legacyCombinations.map(option => ({
    ...option,
    price: Number(product.price) || 0,
    availability: 'visible' as ProductAvailability
  }));
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    price: Number(product.price) || 0,
    description: product.description || '',
    details: product.details || '',
    variations: Array.isArray(product.variations)
      ? (product.variations as unknown[]).filter((option): option is string => typeof option === 'string')
      : [],
    portions: Array.isArray(product.portions)
      ? (product.portions as unknown[]).filter((option): option is string => typeof option === 'string')
      : [],
    options: normalizeProductOptions(product),
    availability: product.availability || 'visible'
  };
}

function serializeProduct<T extends Partial<Product>>(product: T) {
  const { options, ...payload } = product;
  if (!options) return payload;
  return {
    ...payload,
    variations: options,
    portions: []
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [impactProjects, setImpactProjects] = useState<ImpactProject[]>([]);
  const [donationProjects, setDonationProjects] = useState<DonationProject[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [impactPageConfig, setImpactPageConfig] = useState<ImpactPageConfig | null>(null);
  const [donationPageConfig, setDonationPageConfig] = useState<DonationPageConfig | null>(null);
  const [marketPageConfig, setMarketPageConfig] = useState<MarketPageConfig | null>(null);
  const [footerPageConfig, setFooterPageConfig] = useState<FooterPageConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, ordRes, usrRes, impactRes, donationProjectsRes, paymentRes, pageConfigRes, donationConfigRes, marketConfigRes, footerConfigRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/orders'),
          fetch('/api/users'),
          fetch('/api/impact/projects'),
          fetch('/api/donation/projects'),
          fetch('/api/payment/config'),
          fetch('/api/impact/page_config'),
          fetch('/api/donation/page_config'),
          fetch('/api/market/page_config'),
          fetch('/api/footer/page_config')
        ]);
        if (prodRes.ok) {
          const productData = await prodRes.json();
          setProducts(productData.map((product: Product) => normalizeProduct(product)));
        }
        if (catRes.ok) setCategories(await catRes.json());
        if (ordRes.ok) setOrders(await ordRes.json());
        if (usrRes.ok) setUsers(await usrRes.json());
        if (impactRes.ok) {
          const projectData = await impactRes.json();
          setImpactProjects(projectData.map((project: ImpactProject) => ({
            ...project,
            details: project.details || '',
            status_enabled: project.status_enabled !== false
          })));
        }
        if (donationProjectsRes.ok) {
          const projectData = await donationProjectsRes.json();
          setDonationProjects(projectData.map((project: DonationProject) => ({
            ...project,
            description: project.description || '',
            amount: project.amount || '',
            amount_enabled: Boolean(project.amount_enabled)
          })));
        }
        if (paymentRes.ok) setPaymentConfig(await paymentRes.json());
        if (pageConfigRes.ok) setImpactPageConfig(await pageConfigRes.json());
        if (donationConfigRes.ok) setDonationPageConfig(await donationConfigRes.json());
        if (marketConfigRes.ok) {
          const marketConfig = await marketConfigRes.json();
          const heroImages = Array.isArray(marketConfig.hero_images)
            ? marketConfig.hero_images.filter((image: unknown): image is string => typeof image === 'string' && image.trim().length > 0)
            : [];
          const legacyHeroImage = typeof marketConfig.hero_image_url === 'string' ? marketConfig.hero_image_url.trim() : '';
          setMarketPageConfig({
            ...marketConfig,
            hero_image_url: heroImages[0] || legacyHeroImage,
            hero_images: heroImages.length > 0 ? heroImages : legacyHeroImage ? [legacyHeroImage] : [],
            hero_interval_seconds: Math.min(60, Math.max(2, Number(marketConfig.hero_interval_seconds) || 5))
          });
        }
        if (footerConfigRes.ok) setFooterPageConfig(await footerConfigRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serializeProduct(product))
    });
    if (res.ok) {
      const newProduct = await res.json();
      setProducts(prev => [normalizeProduct(newProduct), ...prev]);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serializeProduct(updates))
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === id ? normalizeProduct(updated) : p));
    }
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrderData = {
      ...orderData,
      date: new Date().toISOString(),
      status: 'Pending'
    };
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrderData)
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw new Error(errorBody?.error || 'Unable to create order');
    }
    const createdOrder = await res.json();
    setOrders(prev => [createdOrder, ...prev]);
    return createdOrder;
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
    }
  };

  const addCategory = async (name: string) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      const newCategory = await res.json();
      setCategories(prev => [...prev, newCategory]);
    }
  };

  const deleteCategory = async (name: string) => {
    const res = await fetch(`/api/categories/${name}`, { method: 'DELETE' });
    if (res.ok) {
      setCategories(prev => prev.filter(c => c.name !== name));
    }
  };

  const addImpactProject = async (project: Omit<ImpactProject, 'id'>) => {
    const res = await fetch('/api/impact/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    if (res.ok) {
      const newProject = await res.json();
      setImpactProjects(prev => [newProject, ...prev]);
    }
  };

  const updateImpactProject = async (id: string, updates: Partial<ImpactProject>) => {
    const res = await fetch(`/api/impact/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const updated = await res.json();
      setImpactProjects(prev => prev.map(p => p.id === id ? updated : p));
    }
  };

  const deleteImpactProject = async (id: string) => {
    const res = await fetch(`/api/impact/projects/${id}`, { method: 'DELETE'    });
    if (res.ok) {
      setImpactProjects(impactProjects.filter(p => p.id !== id));
    }
  };

  const addDonationProject = async (project: Omit<DonationProject, 'id'>) => {
    const res = await fetch('/api/donation/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    if (res.ok) {
      const newProject = await res.json();
      setDonationProjects(prev => [newProject, ...prev]);
    }
  };

  const updateDonationProject = async (id: string, updates: Partial<DonationProject>) => {
    const res = await fetch(`/api/donation/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const updated = await res.json();
      setDonationProjects(prev => prev.map(project => project.id === id ? updated : project));
    }
  };

  const deleteDonationProject = async (id: string) => {
    const res = await fetch(`/api/donation/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDonationProjects(prev => prev.filter(project => project.id !== id));
    }
  };

  const updatePaymentConfig = async (config: PaymentConfig) => {
    const res = await fetch('/api/payment/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (res.ok) {
      setPaymentConfig(await res.json());
    }
  };

  const updateImpactPageConfig = async (config: ImpactPageConfig) => {
    const res = await fetch('/api/impact/page_config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (res.ok) {
      setImpactPageConfig(await res.json());
    }
  };

  const updateDonationPageConfig = async (config: DonationPageConfig) => {
    const res = await fetch('/api/donation/page_config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (res.ok) {
      setDonationPageConfig(await res.json());
    }
  };

  const updateMarketPageConfig = async (config: MarketPageConfig) => {
    const res = await fetch('/api/market/page_config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (res.ok) {
      setMarketPageConfig(await res.json());
    }
  };

  const updateFooterPageConfig = async (config: FooterPageConfig) => {
    const res = await fetch('/api/footer/page_config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (res.ok) {
      setFooterPageConfig(await res.json());
    }
  };

  return (
    <DataContext.Provider value={{ 
      products, 
      orders, 
      users, 
      categories, 
      impactProjects,
      donationProjects,
      paymentConfig,
      impactPageConfig,
      donationPageConfig,
      marketPageConfig,
      footerPageConfig,
      addProduct, 
      updateProduct, 
      deleteProduct, 
      addOrder, 
      updateOrder, 
      addCategory, 
      deleteCategory,
      addImpactProject,
      updateImpactProject,
      deleteImpactProject,
      addDonationProject,
      updateDonationProject,
      deleteDonationProject,
      updatePaymentConfig,
      updateImpactPageConfig,
      updateDonationPageConfig,
      updateMarketPageConfig,
      updateFooterPageConfig,
      isLoading 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
