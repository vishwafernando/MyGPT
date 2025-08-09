import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import LoadingScreen from "../../components/common/LoadingScreen";

const AuthCallback = () => {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        const urlParams = new URLSearchParams(window.location.search);
        const fromSignUp = urlParams.get('from') === 'signup' ||
          sessionStorage.getItem('fromSignUp') === 'true';

        if (fromSignUp) {
          sessionStorage.removeItem('fromSignUp');
          window.location.href = "/sign-in";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        window.location.href = "/";
      }
    }
  }, [isSignedIn, isLoaded]);

  return (
    <div className="auth-callback-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Aurora />
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <LoadingScreen />
      </div>
    </div>
  );
};

import Aurora from "../../Backgrounds/Aurora";
export default AuthCallback;
