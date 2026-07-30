/**
 * Authentication Service
 * Handles all authentication using Supabase
 */

import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { AuthUser } from "@/lib/types";

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
  user: AuthUser;
}

/**
 * Converts a Supabase user into the app's user shape.
 *
 * SINGLE SOURCE OF TRUTH for how a display name is derived — prefer the
 * name they gave us, fall back to the local part of their email.
 */
export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split("@")[0] || "",
    email: user.email || "",
  };
}

/**
 * Login user with email and password
 */
export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
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

  return { user: toAuthUser(data.user) };
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
    // Shared mapping for id/email. The submitted name overrides it: we already
    // know it, so there's no need to depend on it having round-tripped through
    // user metadata by the time signUp returns.
    user: { ...toAuthUser(authData.user), name: data.name },
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
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return toAuthUser(user);
}

/**
 * Update user password (used after clicking reset link)
 */
export async function updatePassword(newPassword: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
}
