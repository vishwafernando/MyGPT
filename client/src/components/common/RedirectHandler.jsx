import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clerkJwt = urlParams.get('__clerk_db_jwt');
    
    if (clerkJwt) {
      const cleanPath = location.pathname === '/' ? '/dashboard' : location.pathname;
      console.log('Clerk JWT present; navigating within app to:', cleanPath);
      window.location.replace(cleanPath);
    }
  }, [location, navigate]);

  return null;
};

export default RedirectHandler;
