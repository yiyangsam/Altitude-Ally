import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface Order {
  id: string;
  date: string;
  total: number;
  items: string[];
  status: 'Pending' | 'Delivered' | 'Processing';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: Order[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  adminUser: string;
  adminPass: string;
  login: (email: string, pass: string) => Promise<any>;
  register: (name: string, email: string, pass: string) => Promise<any>;
  requestPasswordReset: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
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

  const fetchProfile = async (id: string, email: string) => {
    try {
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const profile = await res.json();
        setUser({
          ...profile,
          orders: profile.orders || [] // Ensure orders exist or handle via db
        });
      } else {
        // Create emergency dummy object if user not in public.users
        setUser({
          id,
          name: email.split('@')[0],
          email,
          phone: '',
          address: '',
          orders: []
        });
      }
    } catch {
      console.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
         await fetchProfile(session.user.id, session.user.email!);
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
    // 1. Sign up on Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password: pass 
    });
    
    if (authError) return { error: authError };
    if (!authData.user) return { error: new Error("Signup failed silently") };

    // 2. Insert record into public.users via backend API
    const newUserData = {
      id: authData.user.id, // match auth.users(id)
      name,
      email,
      phone: '',
      address: '',
      joinedDate: new Date().toISOString(),
      role: 'Customer'
    };

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUserData)
    });

    if (!res.ok) {
       console.error("Could not sync user to public table");
    }

    return { data: authData };
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

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: '#' + Math.floor(10000 + Math.random() * 90000).toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending'
    };
    setUser(prev => prev ? { ...prev, orders: [newOrder, ...prev.orders] } : null);
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
