import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Buscar a sessão atual ao carregar o hook
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        setAuthState({
          session: data.session,
          user: data.session?.user || null,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          session: null,
          user: null,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    fetchSession();

    // Configurar o listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          session,
          user: session?.user || null,
          isLoading: false,
          error: null,
        });
      }
    );

    // Cleanup ao desmontar o componente
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Funções de autenticação úteis
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
}
