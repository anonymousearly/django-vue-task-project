export interface User {
  id: number;
  username: string;
  email: string;
  is_staff?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
} 