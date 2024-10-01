import { createBrowserRouter } from "react-router-dom";
import Nav from "./nav";
import Home from "./home";
import SignIn from "./sign-in";
import SignUp from "./sign-up";
import Profile from "./profile";
import SignOut from "./sign-out";
import Forgotpassword from "./reset-password";
import Resetpassword from "./password";
import Cart from "../components/cart";
import { Itemdetails } from "./itemDetails";
import Orders from "./orders";
import { CartProvider } from "../contexts/cartcontext";
import Update from "./update-profile";
import SearchResults from "./search";
import Updatepassword from "./update-password";

import {
  AuthProfile,
  AuthSignIn,
  AuthSignUp,
  AuthResetPasswordLink,
  AuthResetPassword,
  AuthLogOut,
  AuthCart,
  AuthItemDetails,
  AuthMyOrders,
  AuthUpdate,
  AuthUpdatePassword,
} from "./auth";
import NotFound from "./invalid";

export function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <CartProvider>
          <Nav />
        </CartProvider>
      ),
      children: [
        { index: true, element: <Home /> },
        {
          path: "/users/sign-in",
          element: (
            <AuthSignIn>
              <SignIn />
            </AuthSignIn>
          ),
        },
        {
          path: "/users/sign-up",
          element: (
            <AuthSignUp>
              <SignUp />
            </AuthSignUp>
          ),
        },
        {
          path: "/users/profile",
          element: (
            <AuthProfile>
              <Profile />
            </AuthProfile>
          ),
        },
        {
          path: "/users/cart",
          element: (
            <AuthCart>
              <Cart />
            </AuthCart>
          ),
        },
        {
          path: "/users/my-orders",
          element: (
            <AuthMyOrders>
              <Orders />
            </AuthMyOrders>
          ),
        },
        {
          path: "/users/reset-password-link",
          element: (
            <AuthResetPasswordLink>
              <Forgotpassword />
            </AuthResetPasswordLink>
          ),
        },
        {
          path: "/users/reset-password/:id",
          element: (
            <AuthResetPassword>
              <Resetpassword />
            </AuthResetPassword>
          ),
        },
        {
          path: "/users/update-password/:id",
          element: (
            <AuthUpdatePassword>
              <Updatepassword />
            </AuthUpdatePassword>
          ),
        },
        {
          path: "/items/item-details/:id",
          element: (
            <AuthItemDetails>
              <Itemdetails />
            </AuthItemDetails>
          ),
        },
        {
          path: "/users/search", // "/users/update/:id"
          element: <SearchResults />,
        },
        {
          path: "/users/update", // "/users/update/:id"
          element: (
            <AuthUpdate>
              <Update />
            </AuthUpdate>
          ),
        },
        {
          path: "/users/sign-out",
          element: (
            <AuthLogOut>
              <SignOut />
            </AuthLogOut>
          ),
        },
        {
          path: "*", // Wildcard for any unmatched routes
          element: <NotFound />,
        },
      ],
    },
  ]);

  return router;
}
