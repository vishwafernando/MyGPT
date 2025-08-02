import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle Clerk authentication redirects
    const urlParams = new URLSearchParams(window.location.search);
    const clerkJwt = urlParams.get('__clerk_db_jwt');
    
    if (clerkJwt) {
      // If we have a Clerk JWT, redirect to dashboard
      const cleanPath = location.pathname === '/' ? '/dashboard' : location.pathname;
      navigate(cleanPath, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default RedirectHandler;
