"use client";

import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  // Check if we're on the client side to avoid hydration mismatch
  const mounted = typeof window !== "undefined";

  return {
    theme,
    setTheme,
    resolvedTheme,
    mounted,
  };
}
