import { createContext } from 'react';

export type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
};

const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  checkAuthStatus: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);
