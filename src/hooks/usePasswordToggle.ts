import { useState, useCallback } from "react";

/**
 * Custom hook for password visibility toggle
 * Provides show state and toggle function
 */
export const usePasswordToggle = () => {
  const [show, setShow] = useState(false);

  const toggle = useCallback(() => {
    setShow((prev) => !prev);
  }, []);

  return { show, toggle };
};

