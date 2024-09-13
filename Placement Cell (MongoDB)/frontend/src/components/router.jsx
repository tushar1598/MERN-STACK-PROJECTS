import { createBrowserRouter } from "react-router-dom";
import Nav from "./nav";
import Home from "./home";
import SignIn from "./sign-in";
import SignUp from "./sign-up";
import Profile from "./profile";
import SignOut from "./sign-out";
import Forgotpassword from "./reset-password";
import Resetpassword from "./password";
import Students from "./students";
import Interviews from "./interview";
import Updatestudent from "./update-student";
import Download from "./download";

import {
  AuthProfile,
  AuthSignIn,
  AuthSignUp,
  AuthResetPasswordLink,
  AuthResetPassword,
  AuthStudent,
  AuthCompany,
  AuthUpdateStudent,
  AuthDownloadStudent,
  AuthLogOut,
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
          path: "/students/add-student",
          element: (
            <AuthStudent>
              <Students />
            </AuthStudent>
          ),
        },
        {
          path: "/students/student-update-page/:id",
          element: (
            <AuthUpdateStudent>
              <Updatestudent />
            </AuthUpdateStudent>
          ),
        },
        {
          path: "/interviews/add-company",
          element: (
            <AuthCompany>
              <Interviews />
            </AuthCompany>
          ),
        },
        {
          path: "/students/download-report",
          element: (
            <AuthDownloadStudent>
              <Download />
            </AuthDownloadStudent>
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
      ],
    },
  ]);

  return router;
}
