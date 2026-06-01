"use client";

import { useEffect, useRef, useState } from "react";
import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleNetwork({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    let cancelled = false;

    const init = async () => {
      await loadSlim(tsParticles);
      if (cancelled) return;
      setReady(true);
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 80;

    let container: { destroy: () => void } | undefined;
    let cancelled = false;

    const start = async () => {
      const c = await tsParticles.load({
        id: "particle-network",
        options: {
          fpsLimit: 60,
          pauseOnBlur: true,
          pauseOnOutsideViewport: true,
          particles: {
            number: {
              value: particleCount,
              density: { enable: true, width: 900, height: 900 },
            },
            color: { value: "#00e5a0" },
            opacity: {
              value: { min: 0.6, max: 0.9 },
            },
            size: {
              value: { min: 1, max: 3 },
            },
            links: {
              enable: true,
              color: "#00e5a0",
              opacity: 0.25,
              distance: 130,
              width: 0.8,
            },
            move: {
              enable: true,
              speed: 0.8,
              direction: "none" as const,
              outModes: { default: "bounce" as const },
            },
          },
          interactivity: {
            detectsOn: "window" as const,
            events: {
              onHover: { enable: true, mode: "grab" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              grab: { distance: 140, links: { opacity: 0.6 } },
              push: { quantity: 2 },
            },
          },
          detectRetina: true,
        },
      });
      if (cancelled) {
        c?.destroy();
        return;
      }
      container = c;
    };

    start();

    return () => {
      cancelled = true;
      container?.destroy();
    };
  }, [ready]);

  return (
    <div
      id="particle-network"
      ref={containerRef}
      className={className}
      style={{ pointerEvents: "none" }}
    />
  );
}
