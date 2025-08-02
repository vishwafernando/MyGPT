import React from "react";
import "./rootLayout.css";
import { Link, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import RedirectHandler from "../../components/common/RedirectHandler";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
      }}
      afterSignOutUrl={`${window.location.origin}/`}
      signInFallbackRedirectUrl={`${window.location.origin}/dashboard`}
      signUpFallbackRedirectUrl={`${window.location.origin}/dashboard`}
      fallbackRedirectUrl={`${window.location.origin}/dashboard`}
      forceRedirectUrl={`${window.location.origin}/dashboard`}
      navigate={(to) => {
        console.log('Clerk navigate called with:', to);
        
        // Force redirect to production domain if localhost is detected
        if (to.includes('localhost:5173')) {
          const correctedUrl = to.replace(/https?:\/\/localhost:5173/, window.location.origin);
          console.log('Redirecting from localhost to:', correctedUrl);
          window.location.href = correctedUrl;
          return;
        }
        
        // If redirecting to external Clerk domain, force to dashboard instead
        if (to.includes('clerk.accounts.dev') || to.includes('accounts.dev')) {
          const dashboardUrl = `${window.location.origin}/dashboard`;
          console.log('Blocking external redirect, going to dashboard:', dashboardUrl);
          window.location.href = dashboardUrl;
          return;
        }
        
        // Ensure all redirects stay within our domain
        if (!to.startsWith(window.location.origin) && !to.startsWith('/')) {
          console.log('External redirect detected, forcing to dashboard');
          window.location.href = `${window.location.origin}/dashboard`;
          return;
        }
        
        console.log('Normal navigation to:', to);
        window.location.href = to;
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RedirectHandler />
        <div className="rootLayout">
          <header className="header">
            <Link to="/" className="logo">
              <img src="/logo.png" alt="Logo" />
              <span>MYGPT AI</span>
            </Link>
            <div className="user">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
