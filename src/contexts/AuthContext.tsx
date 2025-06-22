
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string, role: 'user' | 'admin') => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Get user profile from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            const userWithRole: User = {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: 'user',
              createdAt: profile.created_at,
              password: '', // Not needed for Supabase users
              lastLogin: new Date().toISOString()
            };
            setUser(userWithRole);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      if (session) {
        setSession(session);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (role === 'admin') {
        // Admin login - check against admin_users table
        const { data: adminUsers } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email);
        
        if (adminUsers && adminUsers.length > 0) {
          const adminUser = adminUsers[0];
          // Simple password check (in production, use proper hashing)
          if (password === 'unklab') {
            const userWithRole: User = {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.name,
              role: 'admin',
              createdAt: adminUser.created_at,
              password: '',
              lastLogin: new Date().toISOString()
            };
            setUser(userWithRole);
            localStorage.setItem('admin_user', JSON.stringify(userWithRole));
            return true;
          }
        }
        return false;
      } else {
        // User login - use Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Login error:', error);
          return false;
        }

        return !!data.user;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: 'Terjadi kesalahan saat registrasi' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Terjadi kesalahan saat registrasi' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Check if it's an admin user
      const storedAdmin = localStorage.getItem('admin_user');
      if (storedAdmin) {
        localStorage.removeItem('admin_user');
      } else {
        // Supabase user logout
        await supabase.auth.signOut();
      }
      
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check for stored admin user on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin_user');
    if (storedAdmin && !user) {
      try {
        const adminUser = JSON.parse(storedAdmin);
        setUser(adminUser);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing stored admin user:', error);
        localStorage.removeItem('admin_user');
        setIsLoading(false);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, session, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
