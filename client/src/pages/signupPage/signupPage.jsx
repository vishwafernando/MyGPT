import { useEffect } from "react";
import { useAuth, SignUp } from "@clerk/clerk-react";
import Aurora from "../Backgrounds/Aurora";
import "./signupPage.css";

const SignUpPage = () => {
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
    <div className="signup-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Aurora />
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="signup-container">
          <div className="signup-header">
            <h1>Join MyGPT AI</h1>
          </div>
          
          <SignUp 
            appearance={{
              baseTheme: "dark",
              elements: {
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                footerActionLink: "text-blue-400 hover:text-blue-300"
              }
            }}
            redirectUrl="/dashboard"
            signInUrl="/sign-in"
            path="/sign-up"
            routing="path"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
