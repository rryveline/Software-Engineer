import React, { createContext, useContext, useState, useEffect } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/database";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (
    email: string,
    password: string,
    role: "user" | "admin"
  ) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      console.log("Session user metadata:", session?.user?.user_metadata);
      setSession(session);

      if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed!", session);
        setSession(session);
      }

      if (session?.user) {
        // Get user profile from profiles table with timeout
        let timeoutId: NodeJS.Timeout | null = null;
        let didTimeout = false;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            didTimeout = true;
            reject(new Error("Request to Supabase profiles timed out."));
          }, 15000);
        });
        try {
          let profile = null;
          let profileError = null;
          const profilePromise = supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          const result = await Promise.race([
            profilePromise,
            timeoutPromise,
          ]);
          if (timeoutId) clearTimeout(timeoutId);
          // result hanya dari profilePromise jika tidak timeout
          if (result && typeof result === 'object' && 'data' in result && 'error' in result) {
            profile = result.data;
            profileError = result.error;
          }
          console.log("Profile query result:", profile, profileError);

          if (profile) {
            const role = session.user.user_metadata?.role || "user";
            const userWithRole: User = {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role,
              createdAt: profile.created_at,
              password: "", // Not needed for Supabase users
              lastLogin: new Date().toISOString(),
            };
            setUser(userWithRole);
            setErrorMsg(null);
          } else {
            if (didTimeout) {
              setErrorMsg("Gagal mengambil data profile dari server (timeout). Silakan cek koneksi atau refresh halaman.");
              console.error("Profile query timeout");
            } else {
              setErrorMsg("Gagal mengambil data profile dari server. Silakan cek koneksi atau refresh halaman.");
              console.error("Profile query error:", profileError);
            }
          }
        } catch (err) {
          if (timeoutId) clearTimeout(timeoutId);
          setErrorMsg("Gagal mengambil data profile dari server. Silakan cek koneksi atau refresh halaman.");
          console.error("Profile query exception:", err);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      if (session) {
        setSession(session);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "user" | "admin"
  ): Promise<boolean> => {
    setIsLoading(true);
    console.log("Login start", email, role);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("Login data:", data);
      console.log("User metadata:", data.user?.user_metadata);

      if (error) {
        console.error("Login error:", error);
        return false;
      }

      if (role === "admin") {
        if (data.user && data.user.user_metadata?.role === "admin") {
          return true;
        } else {
          await supabase.auth.signOut();
          return false;
        }
      }

      return !!data.user;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
      console.log("Login end");
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: "Terjadi kesalahan saat registrasi" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Terjadi kesalahan saat registrasi" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, login, register, logout, isLoading }}
    >
      {/* Tampilkan errorMsg jika ada, bisa juga di App.tsx atau komponen global */}
      {errorMsg && (
        <div style={{ color: 'red', textAlign: 'center', margin: 8 }}>{errorMsg}</div>
      )}
      {children}
    </AuthContext.Provider>
  );
};
