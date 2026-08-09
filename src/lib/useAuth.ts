import { useState, useEffect } from 'react';
import { getActiveSession, UserSession } from './authService';

export function useAuth(): {
  user: UserSession | null;
  isLoggedIn: boolean;
  isSuperAdmin: boolean;
  isDpp: boolean;
  isDpw: boolean;
  isGuest: boolean;
} {
  const [user, setUser] = useState<UserSession | null>(() => getActiveSession());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getActiveSession());
    };

    window.addEventListener('skata_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('skata_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const isLoggedIn = user !== null;

  return {
    user,
    isLoggedIn,
    isSuperAdmin: user?.role === 'superadmin',
    isDpp: user?.role === 'dpp' || user?.role === 'superadmin',
    isDpw: user?.role === 'dpw' || user?.role === 'dpp' || user?.role === 'superadmin',
    isGuest: !isLoggedIn
  };
}

