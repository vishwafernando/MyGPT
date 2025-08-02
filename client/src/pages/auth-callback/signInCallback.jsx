import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import LoadingScreen from "../../components/common/LoadingScreen";

const SignInCallback = () => {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // After successful sign-in, redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        // Sign in failed, redirect back to home
        window.location.href = "/";
      }
    }
  }, [isSignedIn, isLoaded]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      color: 'white',
      gap: '20px'
    }}>
      <LoadingScreen />
      <p>Completing sign in...</p>
    </div>
  );
};

export default SignInCallback;
