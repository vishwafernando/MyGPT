import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const ChatDebugger = ({ data }) => {
  const [debugInfo, setDebugInfo] = useState({});
  const { getToken, isSignedIn, userId } = useAuth();

  useEffect(() => {
    const updateDebugInfo = async () => {
      try {
        const token = await getToken();
        setDebugInfo({
          isSignedIn,
          userId,
          hasToken: !!token,
          chatData: data,
          apiUrl: import.meta.env.VITE_API_URL,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        setDebugInfo({
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    };

    updateDebugInfo();
  }, [data, getToken, isSignedIn, userId]);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#000',
      color: '#fff',
      padding: '10px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999,
      borderRadius: '5px'
    }}>
      <h4>Debug Info:</h4>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
};

export default ChatDebugger;
