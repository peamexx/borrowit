import { createBrowserRouter, Navigate } from "react-router";

import App from '../App';
import Login from '@layouts/login/Login';
import Main from '@layouts/main/Main'
import BookList from '@layouts/bookList/BookList'
import { useAuthStore } from "@services/login/global/userStore";
import { PluginManagerProvider } from '@plugins/PluginProvider';

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
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);