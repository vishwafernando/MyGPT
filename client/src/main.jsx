import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/homepage/homepage.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import Chatpage from "./pages/chatpage/chatpage.jsx";
import RootLayout from "./layouts/rootLayout/rootLayout.jsx";
import DashboardLayout from "./layouts/dashboardLayout/dashboardLayout.jsx";
import SignInPage from "./pages/signin/signinPage.jsx";
import SignUpPage from "./pages/signupPage/signupPage.jsx";
import SignInCallback from "./pages/auth-callback/signInCallback.jsx";
import SignUpCallback from "./pages/auth-callback/signUpCallback.jsx";
import { ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import LoadingScreen from "./components/common/LoadingScreen";
import ErrorScreen from "./components/common/ErrorScreen";

const router = createBrowserRouter([
  {
    element: <RootLayout />, 
    errorElement: <ErrorScreen />, 
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/signin-callback",
        element: <SignInCallback />,
      },
      {
        path: "/signup-callback",
        element: <SignUpCallback />,
      },
      {
        path: "/sign-up/sso-callback",
        element: (
          <ClerkLoading>
            <LoadingScreen />
          </ClerkLoading>
        ),
        errorElement: <ErrorScreen message="SSO Callback Error!" />,
      },
      {
        path: "/sign-in/sso-callback",
        element: (
          <ClerkLoaded>
            <LoadingScreen />
          </ClerkLoaded>
        ),
        errorElement: <ErrorScreen message="SSO Callback Error!" />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "chats/:id",
            element: <Chatpage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
