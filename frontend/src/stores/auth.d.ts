import { User, AuthState } from '@/types/auth';

declare module '@/stores/auth' {
  import { User } from '../types/auth';
  
  export function useAuthStore() : {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    
    getUser: User | null;
    getToken: string | null;
    
    register: (email: string, username: string, password: string) => Promise<any>;
    login: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<any>;
    initializeAuth: () => void;
  };
}

export function useAuthStore(): {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  getUser: User | null;
  getToken: string | null;
  
  register: (email: string, username: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<any>;
  initializeAuth: () => void;
}; 