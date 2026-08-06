import { useState, useEffect } from 'react';
import { getActiveSession, UserSession } from './authService';

export function useAuth(): {
  user: UserSession;
  isLoggedIn: boolean;
  isSuperAdmin: boolean;
  isDpp: boolean;
  isDpw: boolean;
  isGuest: boolean;
} {
  const [user, setUser] = useState<UserSession>(() => getActiveSession());

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

  return {
    user,
    isLoggedIn: user.role !== 'guest',
    isSuperAdmin: user.role === 'superadmin',
    isDpp: user.role === 'dpp',
    isDpw: user.role === 'dpw',
    isGuest: user.role === 'guest'
  };
}
