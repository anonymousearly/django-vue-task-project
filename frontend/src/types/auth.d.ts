declare module '@/stores/auth' {
  interface User {
    id: number;
    username: string;
    email: string;
    is_staff?: boolean;
    first_name?: string;
    last_name?: string;
  }

  interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
  }

  export function useAuthStore() {
    return {
      // State
      user: null as User | null,
      token: null as string | null,
      isAuthenticated: false,

      // Getters
      getUser: {} as User | null,
      getToken: "" as string | null,
      isAdmin: false,

      // Actions
      register: (
        email: string, 
        username: string, 
        password: string, 
        password2: string, 
        first_name: string, 
        last_name: string
      ) => Promise<any>,
      
      login: (username: string, password: string) => Promise<any>,
      logout: () => Promise<void>,
      fetchUser: () => Promise<any>,
      initializeAuth: () => void
    }
  }
} 