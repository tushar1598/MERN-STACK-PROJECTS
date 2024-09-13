import { createBrowserRouter } from "react-router-dom";
import Nav from "./nav";
import Home from "./home";
import SignIn from "./sign-in";
import SignUp from "./sign-up";
import Profile from "./profile";
import SignOut from "./sign-out";
import Forgotpassword from "./reset-password";
import Resetpassword from "./password";
import Addexpense from "./expense";
import Editexpense from "./update-expense";
import {
  AuthProfile,
  AuthSignIn,
  AuthSignUp,
  AuthResetPasswordLink,
  AuthResetPassword,
  AuthAddExpense,
  AuthEditExpense,
} from "./auth";

export function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Nav />,
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
          path: "/users/add-expense",
          element: (
            <AuthAddExpense>
              <Addexpense />
            </AuthAddExpense>
          ),
        },
        {
          path: "/users/update-expense/:id",
          element: (
            <AuthEditExpense>
              <Editexpense />
            </AuthEditExpense>
          ),
        },
        { path: "/users/sign-out", element: <SignOut /> },
      ],
    },
  ]);

  return router;
}
