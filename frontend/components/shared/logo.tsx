import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  isScrolled?: boolean;
}

const sizes = {
  sm: { w: 32, h: 32 },
  md: { w: 40, h: 40 },
  lg: { w: 48, h: 48 },
};

const iconSizes = {
  sm: { w: 24, h: 24 },
  md: { w: 32, h: 32 },
  lg: { w: 40, h: 40 },
};

const LOGO_SRC = "/images/nexvora-icon.svg";

export function Logo({ size = "md", showText = true, className = "", isScrolled = true }: LogoProps) {
  const dims = sizes[size];

  return (
    <Link
      href="/"
      className={`flex items-center gap-3 ${className}`}
      style={!isScrolled ? { filter: "drop-shadow(0 0 6px rgba(0,229,160,0.4))" } : undefined}
    >
      <Image
        src={LOGO_SRC}
        alt="Nexvora"
        width={dims.w}
        height={dims.h}
        priority
      />
      {showText && (
        <div className="flex flex-col">
          <span
            className="font-bold tracking-tight text-lg text-white"
            style={!isScrolled ? { textShadow: "0 0 4px rgba(0,229,160,0.5)" } : undefined}
          >
            Nexvora
          </span>
          <span className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase leading-tight">
            CREATIVE AGENCY
          </span>
        </div>
      )}
    </Link>
  );
}

export function LogoIcon({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const dims = iconSizes[size];

  return (
    <Image
      src={LOGO_SRC}
      alt="Nexvora"
      width={dims.w}
      height={dims.h}
      className={className}
    />
  );
}
