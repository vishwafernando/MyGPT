import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import LoadingScreen from "../../components/common/LoadingScreen";
import Aurora from "../Backgrounds/Aurora";

const SignUpCallback = () => {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    }
  }, [isSignedIn, isLoaded]);

  return (
    <div className="sign-up-callback-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Aurora />
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <LoadingScreen />
        <p>Completing sign up...</p>
      </div>
    </div>
  );
};

export default SignUpCallback;
