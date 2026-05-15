import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { width: 32, height: 32 },
  md: { width: 120, height: 40 },
  lg: { width: 160, height: 53 },
};

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/images/nexvora_logo_final (1).png"
        alt=""
        width={sizeClasses.width}
        height={sizeClasses.height}
        className="h-auto"
        priority
      />
      {showText && (
        <span className="font-bold text-white tracking-tight text-lg">
          Nexvora
        </span>
      )}
    </Link>
  );
}

// Icon-only version for favicon/footer
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/nexvora_logo_final (1).png"
      alt="Nexvora"
      width={40}
      height={40}
      className={`h-auto ${className}`}
    />
  );
}