import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import LoadingScreen from "../../components/common/LoadingScreen";

const AuthCallback = () => {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // Check if this is coming from sign-up by checking URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const fromSignUp = urlParams.get('from') === 'signup' || 
                          sessionStorage.getItem('fromSignUp') === 'true';
        
        if (fromSignUp) {
          // Clear the flag and redirect to sign-in
          sessionStorage.removeItem('fromSignUp');
          window.location.href = "/sign-in";
        } else {
          // Coming from sign-in, go to dashboard
          window.location.href = "/dashboard";
        }
      } else {
        // Authentication failed, redirect back to home
        window.location.href = "/";
      }
    }
  }, [isSignedIn, isLoaded]);

  return <LoadingScreen />;
};

export default AuthCallback;
