import { createBrowserRouter, Navigate } from "react-router";

import App from '../App';
import Login from '@layouts/login/Login';
import BookList from '@layouts/bookList/BookList'
import { useAuthStore } from "@services/login/global/userStore";
import { PluginManagerProvider } from '@plugins/PluginProvider';

const LoginLayout = () => {
  const { isLogin } = useAuthStore();

  if (!isLogin()) {
    return <Navigate to="/login" />
  }

  return <PluginManagerProvider><App /></PluginManagerProvider>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginLayout,
    children: [
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