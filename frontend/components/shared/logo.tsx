import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { w: 120, h: 36 },
  md: { w: 160, h: 48 },
  lg: { w: 200, h: 60 },
};

const iconSizes = {
  sm: 28,
  md: 36,
  lg: 44,
};

export function Logo({ size = "md", variant = "dark", showText = true, className = "" }: LogoProps) {
  const dims = sizes[size];
  const src = variant === "light" ? "/images/nexvora-logo-light.svg" : "/images/nexvora-logo.svg";

  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <Image
        src={src}
        alt="Nexvora"
        width={dims.w}
        height={dims.h}
        priority
      />
      {showText && (
        <span className={`font-bold tracking-tight text-lg ${variant === "light" ? "text-zinc-900" : "text-white"}`}>
          Nexvora
        </span>
      )}
    </Link>
  );
}

export function LogoIcon({ size = "md", variant = "dark", className = "" }: { size?: "sm" | "md" | "lg"; variant?: "dark" | "light"; className?: string }) {
  const px = iconSizes[size];
  const src = variant === "light" ? "/images/nexvora-icon-light.svg" : "/images/nexvora-icon.svg";

  return (
    <Image
      src={src}
      alt="Nexvora"
      width={px}
      height={px}
      className={className}
    />
  );
}
