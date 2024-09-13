import { createBrowserRouter } from "react-router-dom";
import Home from "./home";
import SignIn from "./sign-in";
import SignUp from "./sign-up";
import Nav from "./nav";
import Profile from "./profile";
import Resetpassword from "./reset-password";
import {
  AuthSignIn,
  AuthSignUp,
  AuthProfile,
  AuthResetPasswordLink,
  AuthResetPassword,
} from "./auth";
import SignOut from "./sign-out";
import ForgotPasswordLink from "./forgot-password-link";

function Router() {
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
              <ForgotPasswordLink />
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

        { path: "/users/sign-out", element: <SignOut /> },
      ],
    },
  ]);

  return router;
}

export default Router;
