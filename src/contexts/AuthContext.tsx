
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/database';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'admin') => Promise<boolean>;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call - replace with actual authentication
    try {
      // Mock users for demo
      const mockUsers: User[] = [
        {
          id: 'admin-1',
          email: 'admin@unklab.ac.id',
          password: 'admin123',
          name: 'Administrator',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 'user-1',
          email: 'user@gmail.com',
          password: 'user123',
          name: 'User Demo',
          role: 'user',
          createdAt: new Date().toISOString()
        }
      ];

      const foundUser = mockUsers.find(u => 
        u.email === email && 
        u.password === password && 
        u.role === role
      );

      if (foundUser) {
        const userWithLastLogin = { ...foundUser, lastLogin: new Date().toISOString() };
        setUser(userWithLastLogin);
        localStorage.setItem('user', JSON.stringify(userWithLastLogin));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
