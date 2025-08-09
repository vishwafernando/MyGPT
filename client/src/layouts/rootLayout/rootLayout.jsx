import "./rootLayout.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ClerkProvider, SignedIn, UserButton, useAuth } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import RedirectHandler from "../../components/common/RedirectHandler";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

const LayoutContent = () => {
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAuthPage = location.pathname === '/sign-in' || location.pathname === '/sign-up';

  return (
    <div className="rootLayout">
      {!isDashboard && !isAuthPage && (
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-brand">
              <img src="/logo.png" alt="MyGPT AI" className="navbar-logo" />
              <span className="navbar-title">MyGPT AI</span>
            </Link>
            <div className="navbar-buttons">
              {isSignedIn ? (
                <SignedIn>
                  <UserButton />
                </SignedIn>
              ) : (
                <>
                  <Link to="/sign-up" className="navbar-btn secondary">Sign Up</Link>
                  <Link to="/sign-in" className="navbar-btn primary">Login</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
      <main className={isDashboard ? 'dashboard-main' : (isAuthPage ? 'auth-main' : '')}>
        <Outlet />
      </main>
    </div>
  );
};

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
        if (to.startsWith('/')) {
          window.location.href = to;
          return;
        }
        if (to.startsWith(window.location.origin)) {
          window.location.href = to;
          return;
        }
        window.location.href = `${window.location.origin}/dashboard`;
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RedirectHandler />
        <LayoutContent />
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
