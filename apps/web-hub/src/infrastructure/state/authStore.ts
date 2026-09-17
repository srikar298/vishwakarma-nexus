import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AuthUser {
  publicId: string;
  firstName: string;
  lastName: string;
  role: string;
  digitalId?: string;
  phone?: string;
  kula?: string;
  trade?: string;
  district?: string;
  mandal?: string;
  state?: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken: string | null, user: AuthUser) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, refreshToken, user) => {
        if (token) {
          localStorage.setItem('vkc_token', token);
        }
        if (refreshToken) {
          localStorage.setItem('vkc_refresh_token', refreshToken);
        }
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: !!token,
        });
      },

      updateUser: (partial) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        }));
      },

      logout: () => {
        localStorage.removeItem('vkc_token');
        localStorage.removeItem('vkc_refresh_token');
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'vkc-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
