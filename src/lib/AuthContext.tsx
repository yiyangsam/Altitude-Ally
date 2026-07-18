import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface Order {
  id: string;
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
  address: string;
  joinedDate: string;
  orders: Order[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  adminUser: string;
  adminPass: string;
  login: (email: string, pass: string) => Promise<any>;
  register: (name: string, email: string, pass: string) => Promise<any>;
  resendSignupConfirmation: (email: string) => Promise<any>;
  requestPasswordReset: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  addOrder: (order: Order) => void;
  updateAdminCredentials: (user: string, pass: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [adminUser, setAdminUser] = useState('altitude_admin');
  const [adminPass, setAdminPass] = useState('altitude_admin_password');

  useEffect(() => {
    const fetchAdminConfig = async () => {
      try {
        const res = await fetch('/api/admin/config');
        if (res.ok) {
          const config = await res.json();
          if (config && config.username) {
            setAdminUser(config.username);
            setAdminPass(config.password);
          }
        }
      } catch (err) {
        console.error("Failed to load global admin config", err);
      }
    };
    fetchAdminConfig();
  }, []);

  const fetchUserOrders = async (id: string): Promise<Order[]> => {
    try {
      const res = await fetch(`/api/users/${id}/orders`);
      if (!res.ok) return [];

      const orders = await res.json();
      return orders.map((order: Order) => ({
        id: order.id,
        date: order.date,
        total: Number(order.total),
        items: Array.isArray(order.items) ? order.items : [],
        status: order.status
      }));
    } catch (error) {
      console.error('Failed to fetch customer orders', error);
      return [];
    }
  };

  const fetchProfile = async (id: string, email: string, metadata: Record<string, any> = {}) => {
    try {
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const profile = await res.json();
        const orders = await fetchUserOrders(id);
        setUser({
          ...profile,
          orders
        });
      } else if (res.status === 404) {
        const newProfile = {
          id,
          name: metadata.full_name || email.split('@')[0],
          email,
          phone: '',
          address: '',
          joinedDate: metadata.joined_date || new Date().toISOString(),
          role: 'Customer'
        };
        const createRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProfile)
        });
        const createdProfile = createRes.ok ? await createRes.json() : newProfile;
        const orders = await fetchUserOrders(id);
        setUser({ ...createdProfile, orders });
      } else {
        throw new Error(`Profile request failed with status ${res.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setUser({
        id,
        name: metadata.full_name || email.split('@')[0],
        email,
        phone: '',
        address: '',
        joinedDate: metadata.joined_date || new Date().toISOString(),
        orders: []
      });
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!, session.user.user_metadata);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
         await fetchProfile(session.user.id, session.user.email!, session.user.user_metadata);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Removed local storage watcher effects

  const login = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { error };
    return { data };
  };

  const register = async (name: string, email: string, pass: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: name,
          joined_date: new Date().toISOString()
        }
      }
    });
    
    if (authError) return { error: authError };
    if (!authData.user) return { error: new Error("Signup failed silently") };

    return { data: authData };
  };

  const resendSignupConfirmation = async (email: string) => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (error) return { error };
    return { data };
  };

  const requestPasswordReset = async (email: string) => {
    const redirectTo = `${window.location.origin}/update-password`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return { error };
    return { data };
  };

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) return { error };
    return { data };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return false;
    
    // Save locally immediately
    setUser(prev => prev ? { ...prev, ...data } : null);
    
    // Attempt DB push
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    return res.ok;
  };

  const addOrder = (order: Order) => {
    setUser(prev => prev ? {
      ...prev,
      orders: prev.orders.some(existingOrder => existingOrder.id === order.id)
        ? prev.orders
        : [order, ...prev.orders]
    } : null);
  };

  const updateAdminCredentials = async (newUser: string, newPass: string) => {
    setAdminUser(newUser);
    setAdminPass(newPass);

    try {
      await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUser, password: newPass })
      });
    } catch (err) {
      console.error("Failed to sync admin credentials globally", err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      adminUser, 
      adminPass, 
      login, 
      register,
      resendSignupConfirmation,
      requestPasswordReset,
      updatePassword,
      logout, 
      updateProfile, 
      addOrder,
      updateAdminCredentials 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
