/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

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
  token: string;
}

class AuthService {
  private readonly baseURL = "/api/auth";

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Login failed. Please try again.");
    }

    return response.json();
  }

  /**
   * Register a new user
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Sign up failed. Please try again.");
    }

    return response.json();
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await fetch(`${this.baseURL}/logout`, {
      method: "POST",
    });
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || "Failed to send reset email. Please try again."
      );
    }
  }
}

export const authService = new AuthService();
