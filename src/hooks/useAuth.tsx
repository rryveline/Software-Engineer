
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInAsAdmin: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for admin session in localStorage
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      const adminData = JSON.parse(adminSession);
      if (adminData.username === 'joreju') {
        setIsAdmin(true);
        setLoading(false);
        return;
      }
    }

    // Set up auth state listener for regular users
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(false);
        setLoading(false);
      }
    );

    // Check for existing session for regular users
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAdmin(false);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signInAsAdmin = async (username: string, password: string) => {
    if (username === 'joreju' && password === 'admin123') {
      const adminSession = {
        username: 'joreju',
        loginTime: new Date().toISOString(),
        isAdmin: true
      };
      localStorage.setItem('admin_session', JSON.stringify(adminSession));
      setIsAdmin(true);
      setUser(null);
      setSession(null);
      return { error: null };
    } else {
      return { error: { message: 'Username atau password admin salah' } };
    }
  };

  const signOut = async () => {
    if (isAdmin) {
      localStorage.removeItem('admin_session');
      setIsAdmin(false);
    } else {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      signUp,
      signIn,
      signInAsAdmin,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
