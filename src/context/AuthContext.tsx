import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase/config';

const TOKEN_KEY = 'secure_auth_token';
const USER_KEY  = 'secure_auth_user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  setTokenAndUser: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  setTokenAndUser: async () => {},
  signOut: async () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [token, setToken]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedToken) setToken(savedToken);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        localStorage.setItem(TOKEN_KEY, idToken);
        localStorage.setItem(USER_KEY, JSON.stringify({
          uid:         firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber,
          displayName: firebaseUser.displayName,
        }));
        setToken(idToken);
        setUser(firebaseUser);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const setTokenAndUser = async (firebaseUser: User) => {
    const idToken = await firebaseUser.getIdToken();
    localStorage.setItem(TOKEN_KEY, idToken);
    localStorage.setItem(USER_KEY, JSON.stringify({
      uid:         firebaseUser.uid,
      phoneNumber: firebaseUser.phoneNumber,
      displayName: firebaseUser.displayName,
    }));
    setToken(idToken);
    setUser(firebaseUser);
  };

  const handleSignOut = async () => {
    await auth.signOut();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      setTokenAndUser,
      signOut: handleSignOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};