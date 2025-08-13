import { createBrowserRouter, Navigate } from "react-router";

import App from '../App';
import Login from '@layouts/login/Login';
import Main from '@layouts/main/Main'
import BookList from '@layouts/bookList/BookList'
import DueList from '@layouts/dueList/DueList'
import DueListAllUsers from '@layouts/dueListAllUsers/DueListAllUsers'
import { useAuthStore } from "@services/auth/userStore";
import { PluginManagerProvider } from '@plugins/PluginProvider';
import { PERMISSIONS } from '@data/menu/global/menuData';

interface PermissionGuardType {
  children: React.ReactNode;
  permissionKey: string;
}

const LoginLayout = () => {
  const { user, isLogin, logout } = useAuthStore();

  if (!isLogin()) {
    return <Navigate to="/login" />
  }
  if (user?.companyName !== (import.meta.env.VITE_CLIENT || 'default')) {
    return logout();
  }

  return <PluginManagerProvider><App /></PluginManagerProvider>;
}

const PermissionGuard = ({ children, permissionKey }: PermissionGuardType) => {
  const { hasPermissions } = useAuthStore();

  if (!hasPermissions(permissionKey)) {
    return <Navigate to="/" />
  }

  return <PluginManagerProvider>{children}</PluginManagerProvider>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginLayout,
    children: [
      {
        path: "/",
        Component: Main,
      },
      {
        path: "/book",
        children: [
          { path: "list", Component: BookList },
        ],
      },
      {
        path: "/due",
        children: [
          { path: "list", Component: DueList },
          { path: "users", Component: () => <PermissionGuard permissionKey={PERMISSIONS.OVERDUE_READ}><DueListAllUsers /></PermissionGuard> },
        ],
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);