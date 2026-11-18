import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { auth } from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    let active = true;
    auth.getSession().then((u) => { if (active) { setUser(u); setLoading(false); } });
    const unsub = auth.onChange((u, event) => {
      if (!active) return;
      setUser(u);
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
      setLoading(false);
    });
    return () => { active = false; unsub(); };
  }, []);

  const signUp = useCallback(async (input) => {
    const res = await auth.signUp(input);
    if (res.user && !res.needsConfirmation) setUser(res.user);
    return res;
  }, []);
  const signIn = useCallback(async (input) => { const u = await auth.signIn(input); setUser(u); return u; }, []);
  const signOut = useCallback(async () => { await auth.signOut(); setUser(null); }, []);
  const updateProfile = useCallback(async (patch) => {
    const u = await auth.updateProfile(user.id, patch);
    setUser(u);
    return u;
  }, [user]);

  const value = useMemo(
    () => ({ user, loading, recovering, signUp, signIn, signOut, updateProfile }),
    [user, loading, recovering, signUp, signIn, signOut, updateProfile],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
