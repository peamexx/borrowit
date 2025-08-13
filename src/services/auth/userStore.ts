import { create } from 'zustand';
import { persist } from "zustand/middleware";
import { doLogin, doLogout } from '@services/auth/login';

export type User = {
  userRefStr: string;
  username: string;
  id: string;
  companyName?: string;
  roleName?: string;
  permissions?: string[];
};

type AuthState = {
  user: User | null;
  isLogin: () => boolean;
  login: (formData: any) => Promise<{ success: boolean }>;
  logout: () => Promise<boolean>;
  hasPermissions: (key: string) => boolean;
};

const EXPIRY_MS = 24 * 60 * 60 * 1000; // 하루

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      isLogin: () => get().user ? true : false,

      login: async (formData) => {
        try {
          const userData = await doLogin(formData);
          if (userData) {
            set({ user: userData ?? null, });
            return { success: true, user: userData };
          } else {
            return { success: false, message: 'No User' };
          }
        } catch (err: any) {
          return { success: false, message: 'Login Fail' };
        }
      },

      logout: async () => {
        try {
          const res = await doLogout();
          if (res) {
            set({ user: null });
            return true;
          } else {
            return false;
          }
        } catch (err) {
          return false;
        }
      },

      hasPermissions: (key: string) => {
        const permissions = get().user?.permissions;
        if (!permissions) return false;

        return permissions.includes(key);
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          try {
            const parsed = JSON.parse(str);

            if (Date.now() - parsed.timestamp > EXPIRY_MS) {
              localStorage.removeItem(name);
              return null;
            }

            return parsed.value;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(
            name,
            JSON.stringify({
              value,
              timestamp: Date.now(),
            })
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
