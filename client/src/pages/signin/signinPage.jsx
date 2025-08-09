import React, { useEffect } from "react";
import { useAuth, SignIn } from "@clerk/clerk-react";
import Aurora from "../Backgrounds/Aurora";
import "./signinPage.css";

const SignInPage = () => {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      window.location.href = "/dashboard";
    }
  }, [isSignedIn]);

  if (isSignedIn) {
    return null; 
  }

  return (
    <div className="signinpage" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Aurora />
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="signin-container">
          <div className="signin-header">
            <h1>Welcome Back to MyGPT</h1>
          </div>
          
          <SignIn 
            appearance={{
              baseTheme: "dark",
              elements: {
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                footerActionLink: "text-blue-400 hover:text-blue-300"
              }
            }}
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;