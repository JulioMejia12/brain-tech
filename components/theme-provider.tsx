"use client";

import React, { useEffect, useState, createContext, useContext } from "react";

type Props = {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: "light" | "dark" | "system" | string;
  enableSystem?: boolean;
};

const ThemeContext = createContext<{
  theme: string | null;
  setTheme: (t: string) => void;
} | null>(null);

export function ThemeProvider({ children, defaultTheme = "system", enableSystem = true }: Props) {
  // Use a stable initial theme to avoid SSR/CSR mismatches. Default to 'light' when
  // the configured default is 'system' because the server cannot detect the user's
  // preferred color scheme.
  const initial = defaultTheme === "dark" ? "dark" : "light";
  const [theme, setThemeState] = useState<string>(initial);

  useEffect(() => {
    // On the client adjust to stored or system preference.
    const stored = localStorage.getItem("theme");
    if (stored) {
      setThemeState(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
      return;
    }

    if (defaultTheme === "system" && enableSystem && window.matchMedia) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const t = prefersDark ? "dark" : "light";
      setThemeState(t);
      document.documentElement.classList.toggle("dark", t === "dark");
      return;
    }

    const t = defaultTheme === "dark" ? "dark" : "light";
    setThemeState(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, [defaultTheme, enableSystem]);

  const setTheme = (t: string) => {
    try {
      localStorage.setItem("theme", t);
    } catch (e) {
      // ignore
    }
    setThemeState(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
