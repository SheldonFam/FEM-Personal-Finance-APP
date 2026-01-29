/**
 * Authentication Service
 * Handles all authentication using Supabase
 */

import { createClient } from "@/lib/supabase/client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Login user with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Login failed. Please try again.");
  }

  return {
    user: {
      id: data.user.id,
      name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "",
      email: data.user.email || "",
    },
  };
}

/**
 * Register a new user
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!authData.user) {
    throw new Error("Sign up failed. Please try again.");
  }

  return {
    user: {
      id: authData.user.id,
      name: data.name,
      email: authData.user.email || "",
    },
  };
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split("@")[0] || "",
    email: user.email || "",
  };
}
