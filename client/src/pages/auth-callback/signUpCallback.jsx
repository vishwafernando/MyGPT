import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import LoadingScreen from "../../components/common/LoadingScreen";

const SignUpCallback = () => {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // After successful sign-up, redirect to sign-in page
        window.location.href = "/sign-in";
      } else {
        // Sign up failed, redirect back to home
        window.location.href = "/";
      }
    }
  }, [isSignedIn, isLoaded]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        color: "white",
        gap: "20px",
      }}
    >
      <LoadingScreen />
      <p>Completing sign up...</p>
    </div>
  );
};

export default SignUpCallback;
