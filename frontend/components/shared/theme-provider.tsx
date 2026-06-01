"use client";

import { useState, useEffect, useCallback } from "react";

const THEME_KEY = "homepage-theme";
const THEME_EVENT = "toggle-home-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [lightMode, setLightMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light") setLightMode(true);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setLightMode((prev) => {
      const next = !prev;
      localStorage.setItem(THEME_KEY, next ? "light" : "dark");
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = () => toggle();
    window.addEventListener(THEME_EVENT, handler);
    return () => window.removeEventListener(THEME_EVENT, handler);
  }, [toggle]);

  if (!mounted) return <>{children}</>;

  return <div className={lightMode ? "light" : ""}>{children}</div>;
}
