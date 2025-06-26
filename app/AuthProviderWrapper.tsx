'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

// Define context type
type AuthContextType = {
  session: Session | null;
};

// Create context with default value
export const AuthContext = createContext<AuthContextType>({ session: null });

export default function AuthProviderWrapper({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Load the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Subscribe to session changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access the context
export const useAuth = () => useContext(AuthContext);
