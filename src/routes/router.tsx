import { createBrowserRouter, Navigate } from "react-router";
import App from '../App';
import Login from '../layouts/login/global/Login';
import BookList from '../layouts/books/book-list/BookList'
import { useAuthStore } from "@services/login/global/userStore";

const LoginLayout = () => {
  const { isLogin } = useAuthStore();

  if (!isLogin()) {
    return <Navigate to="/login" />
  }

  return <App />;
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
      {
        path: "/book",
        children: [
          { path: "list", Component: BookList },
        ],
      },
      // {
      //   path: "auth",
      //   Component: AuthLayout,
      //   children: [
      //     { path: "login", Component: Login },
      //     { path: "register", Component: Register },
      //   ],
      // },
      // {
      //   path: "concerts",
      //   children: [
      //     { index: true, Component: ConcertsHome },
      //     { path: ":city", Component: ConcertsCity },
      //     { path: "trending", Component: ConcertsTrending },
      //   ],
      // },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);