import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'guest';

export interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
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
    const storedUser = localStorage.getItem('aero_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate authentication - replace with real API call
    if (username === 'admin' && password === 'admin123') {
      const adminUser: User = { username: 'admin', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('aero_user', JSON.stringify(adminUser));
      return true;
    } else if (username === 'guest' && password === 'guest123') {
      const guestUser: User = { username: 'guest', role: 'guest' };
      setUser(guestUser);
      localStorage.setItem('aero_user', JSON.stringify(guestUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aero_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
 
};