/**
 * Authentication Form Validation Rules
 * Centralized validation schemas for login and signup forms
 */

export const AUTH_VALIDATION = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
  },
  name: {
    required: "Name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
  },
} as const;

export const PASSWORD_MIN_LENGTH = 8;

/**
 * Validation function for password confirmation
 */
export const validatePasswordConfirmation = (
  password: string
) => (value: string) => {
  return value === password || "Passwords do not match";
};