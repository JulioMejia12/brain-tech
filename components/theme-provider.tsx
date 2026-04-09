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
  const [theme, setThemeState] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored) {
      setThemeState(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
      return;
    }

    if (defaultTheme === "system" && enableSystem && typeof window !== "undefined") {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
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
