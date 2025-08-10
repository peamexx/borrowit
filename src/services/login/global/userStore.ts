import { create } from 'zustand';
import { persist } from "zustand/middleware";
import { doLogin, doLogout } from '@services/login/global/login';

export type User = {
  username: string;
  id: string;
  roleName?: string;
  permissions?: string[];
};

type AuthState = {
  user: User | null;
  error: string | null;

  isLogin: () => boolean;
  login: (formData: any) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      error: null,

      isLogin: () => get().user ? true : false,

      login: async (formData) => {
        set({ error: null });
        try {
          const userData = await doLogin(formData);
          if (userData) {
            set({
              user: userData ?? null,
              error: null,
            });
          }
        } catch (err: any) {
          set({
            error: err?.message ?? "Login Fail",
          });
          throw err;
        }
      },

      logout: async () => {
        const res = await doLogout();
        if (res) {
          set({ user: null, error: null });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
