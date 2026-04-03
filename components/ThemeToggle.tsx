"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="h-10 w-10 rounded-full border border-cyan-400/40 bg-slate-900/70"
        aria-label="Cambiar tema"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-10 w-10 rounded-full border border-cyan-400/40 bg-white/80 text-slate-900 shadow-lg backdrop-blur transition hover:scale-105 dark:bg-slate-900/70 dark:text-cyan-100"
      aria-label="Cambiar tema"
    >
      <span aria-hidden>{isDark ? "☀" : "☾"}</span>
    </button>
  );
}
