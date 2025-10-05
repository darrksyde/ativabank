import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

// Simple user interface
interface SimpleUser {
  email: string;
  role: 'admin' | 'super-admin' | 'customer';
  name: string;
}

interface AuthContextType {
  currentUser: SimpleUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hardcoded users for now
const USERS = {
  'admin@ativabank.com': { password: 'admin123', role: 'admin' as const, name: 'Admin User' },
  'superadmin@ativabank.com': { password: 'super123', role: 'super-admin' as const, name: 'Super Admin' },
  'customer@ativabank.com': { password: 'customer123', role: 'customer' as const, name: 'John Customer' },
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<SimpleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ativabank_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('ativabank_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = USERS[email as keyof typeof USERS];
    
    if (user && user.password === password) {
      const userData: SimpleUser = {
        email,
        role: user.role,
        name: user.name
      };
      
      setCurrentUser(userData);
      localStorage.setItem('ativabank_user', JSON.stringify(userData));
      
      // Redirect based on role
      setTimeout(() => {
        router.replace(`/${user.role}`);
      }, 100);
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ativabank_user');
    router.replace('/');
  };

  const value: AuthContextType = {
    currentUser,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

interface AuthProviderProps {
  children: ReactNode;
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

