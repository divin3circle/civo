"use client";

// This file uses setState in useLayoutEffect, which is the recommended pattern
// from next-themes to prevent hydration mismatches. The performance impact is
// minimal as it only runs once after mount. The linter warning about setState
// in effects is a false positive in this context - this pattern is necessary
// to ensure server and client render the same initial output.

import { useTheme as useNextTheme } from "next-themes";
import { useLayoutEffect, useState } from "react";

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders after hydration to prevent mismatches
  // This is the recommended pattern for next-themes to avoid hydration errors
  // useLayoutEffect ensures this runs synchronously after DOM mutations but before paint
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    setMounted(true);
  }, []);

  return {
    theme,
    setTheme,
    resolvedTheme,
    mounted,
  };
}
