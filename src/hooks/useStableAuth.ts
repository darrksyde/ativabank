import { useState, useEffect, useRef } from 'react';

/**
 * Stable authentication state hook that prevents flashing and race conditions
 */
export function useStableAuth() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const initializeRef = useRef(false);
  
  useEffect(() => {
    // Prevent multiple initializations
    if (initializeRef.current) return;
    initializeRef.current = true;

    const initAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const sessionData = localStorage.getItem('ativabank_session');
          if (sessionData) {
            const parsedUser = JSON.parse(sessionData);
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('ativabank_session');
      } finally {
        setIsReady(true);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initAuth, 10);
    return () => clearTimeout(timer);
  }, []);

  return { isReady, user, setUser };
}