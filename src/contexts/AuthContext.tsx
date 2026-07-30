"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toAuthUser } from "@/services/auth.service";
import type { AuthUser } from "@/lib/types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Who the cache currently belongs to. Held in a ref, not state, because the
  // auth subscription below is established once and would otherwise close over
  // the value as it was on first render — which is null, making the
  // cross-account clear below unreachable.
  const cachedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      if (supabaseUser) {
        cachedUserIdRef.current = supabaseUser.id;
        setUser(toAuthUser(supabaseUser));
      }
      setIsLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // A different user than the cache holds — drop it before their data
        // is read as the new user's.
        if (
          cachedUserIdRef.current &&
          cachedUserIdRef.current !== session.user.id
        ) {
          queryClient.clear();
        }
        cachedUserIdRef.current = session.user.id;
        setUser(toAuthUser(session.user));
      } else {
        // Signed out - clear all cached data
        cachedUserIdRef.current = null;
        queryClient.clear();
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, queryClient]);

  const signOut = async () => {
    // Clear all cached data before signing out
    cachedUserIdRef.current = null;
    queryClient.clear();
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
