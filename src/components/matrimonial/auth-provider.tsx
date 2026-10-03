"use client";

import * as React from "react";

export interface AuthMember {
  id: string;
  name: string;
  email: string;
  city: string | null;
  profession: string | null;
  height: string | null;
  about: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

interface AuthContextValue {
  member: AuthMember | null;
  /** True once the initial /api/auth/me check has settled. */
  ready: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    city?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (data: {
    name?: string;
    city?: string;
    profession?: string;
    height?: string;
    about?: string;
    avatarUrl?: string | null;
  }) => Promise<{
    ok: boolean;
    error?: string;
  }>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = React.useState<AuthMember | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await res.json()) as { member: AuthMember | null };
        if (!cancelled) setMember(data.member);
      } catch {
        // offline — stay signed out
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = React.useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { member?: AuthMember; error?: string };
      if (!res.ok || !data.member) return { ok: false, error: data.error ?? "Sign in failed." };
      setMember(data.member);
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error — please try again." };
    }
  }, []);

  const signUp = React.useCallback(
    async (input: { name: string; email: string; password: string; city?: string }) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = (await res.json()) as { member?: AuthMember; error?: string };
        if (!res.ok || !data.member) {
          return { ok: false, error: data.error ?? "Could not create the account." };
        }
        setMember(data.member);
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error — please try again." };
      }
    },
    []
  );

  const updateProfile = React.useCallback(
    async (input: {
      name?: string;
      city?: string;
      profession?: string;
      height?: string;
      about?: string;
      avatarUrl?: string | null;
    }) => {
      try {
        const res = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = (await res.json()) as { member?: AuthMember; error?: string };
        if (!res.ok || !data.member) {
          return { ok: false, error: data.error ?? "Could not update your profile." };
        }
        setMember(data.member);
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error — please try again." };
      }
    },
    []
  );

  const signOut = React.useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore — clear client state regardless
    }
    setMember(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ member, ready, signIn, signUp, updateProfile, signOut }),
    [member, ready, signIn, signUp, updateProfile, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
