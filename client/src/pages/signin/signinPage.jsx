import React, { useEffect } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import "./signinPage.css";

const SignInPage = () => {
  const { isSignedIn } = useAuth();
  const clerk = useClerk();

  useEffect(() => {
    if (isSignedIn) {
      // If already signed in, redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      // Get the current domain dynamically
      const currentOrigin = window.location.origin;
      const redirectUrl = `${currentOrigin}/signin-callback`;
      
      // Redirect to the hosted Clerk sign-in page with callback URL
      window.location.href = `https://calm-sponge-30.accounts.dev/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`;
    }
  }, [isSignedIn]);

  return (
    <div className="signinpage">
      <div style={{ 
        color: 'white', 
        textAlign: 'center',
        fontSize: '18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div className="loading-spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid #374151',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Redirecting to sign in...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SignInPage;