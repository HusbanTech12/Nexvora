/*
  ANIMATION: star-field
  PROPERTY:  canvas (opacity on each star via rAF) — compositor-safe
  THREAD:    GPU (via canvas 2d context)
  COST:      zero repaint (no DOM mutations)
*/

"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
  hue: number;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let w = 0;
    let h = 0;

    const count = window.innerWidth < 768 ? 80 : 220;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
    };

    const createStars = () => {
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() < 0.2 ? Math.random() * 2 + 1.5 : Math.random() * 1.2 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.008,
        hue: Math.random() < 0.3 ? 170 : Math.random() < 0.5 ? 160 : 0,
      }));
    };

    const draw = (now: number) => {
      ctx!.clearRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = Math.sin(now * s.speed + s.phase);
        const alpha = 0.15 + (twinkle * 0.5 + 0.5) * 0.7;

        if (s.hue > 0) {
          ctx!.fillStyle = `hsla(${s.hue}, 70%, 70%, ${alpha})`;
        } else {
          ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }

        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx!.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createStars();

    let hidden = false;

    const onVisibility = () => {
      if (document.hidden) {
        hidden = true;
        cancelAnimationFrame(animationId);
      } else {
        hidden = false;
        animationId = requestAnimationFrame(draw);
      }
    };

    const onResize = () => {
      resize();
      createStars();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ willChange: "transform" }}
    />
  );
}
