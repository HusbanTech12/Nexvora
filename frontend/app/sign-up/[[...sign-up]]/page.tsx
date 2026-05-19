import { SignUp } from "@clerk/nextjs";
import { AnimatedBackground } from "@/components/shared/animated-background";

const clerkAppearance = {
  baseTheme: undefined,
  elements: {
    rootBox: {
      width: "100%",
      maxWidth: "420px",
    },
    card: {
      background: "rgba(24, 24, 27, 0.85)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(63, 63, 70, 0.5)",
      borderRadius: "16px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(139, 92, 246, 0.15)",
      padding: "32px",
    },
    headerTitle: {
      color: "#ffffff",
      fontSize: "24px",
      fontWeight: "700",
    },
    headerSubtitle: {
      color: "#a1a1aa",
      fontSize: "14px",
    },
    socialButtonsBlockButton: {
      background: "rgba(39, 39, 42, 0.8)",
      border: "1px solid rgba(63, 63, 70, 0.5)",
      color: "#ffffff",
      borderRadius: "10px",
      padding: "10px 16px",
      transition: "all 0.2s ease",
    },
    socialButtonsBlockButton__hover: {
      background: "rgba(63, 63, 70, 0.8)",
      borderColor: "rgba(139, 92, 246, 0.5)",
    },
    socialButtonsBlockButtonText: {
      color: "#e4e4e7",
      fontSize: "14px",
      fontWeight: "500",
    },
    dividerLine: {
      background: "rgba(63, 63, 70, 0.5)",
    },
    dividerText: {
      color: "#71717a",
      fontSize: "12px",
    },
    formFieldLabel: {
      color: "#a1a1aa",
      fontSize: "13px",
      fontWeight: "500",
    },
    formFieldInput: {
      background: "rgba(39, 39, 42, 0.6)",
      border: "1px solid rgba(63, 63, 70, 0.5)",
      borderRadius: "10px",
      color: "#ffffff",
      fontSize: "14px",
      padding: "10px 14px",
      transition: "all 0.2s ease",
    },
    formFieldInput__focus: {
      borderColor: "rgba(139, 92, 246, 0.6)",
      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
    },
    formButtonPrimary: {
      background: "linear-gradient(135deg, #7c3aed, #8b5cf6, #a78bfa)",
      border: "none",
      borderRadius: "10px",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "600",
      padding: "12px 16px",
      textTransform: "none",
      boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
      transition: "all 0.2s ease",
    },
    formButtonPrimary__hover: {
      background: "linear-gradient(135deg, #6d28d9, #7c3aed, #8b5cf6)",
      boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
    },
    footerActionText: {
      color: "#a1a1aa",
      fontSize: "13px",
    },
    footerActionLink: {
      color: "#a78bfa",
      fontWeight: "500",
      textDecoration: "none",
    },
    footerActionLink__focus: {
      color: "#c4b5fd",
    },
    identityPreviewText: {
      color: "#e4e4e7",
    },
    identityPreviewEditButton: {
      color: "#a78bfa",
    },
    formResendCodeLink: {
      color: "#a78bfa",
    },
    badge: {
      background: "rgba(139, 92, 246, 0.2)",
      color: "#c4b5fd",
    },
    alertText: {
      color: "#fca5a5",
    },
    alert: {
      background: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      borderRadius: "8px",
    },
  },
  variables: {
    colorPrimary: "#8b5cf6",
    colorText: "#ffffff",
    colorTextSecondary: "#a1a1aa",
    colorBackground: "#18181b",
    colorInputBackground: "rgba(39, 39, 42, 0.6)",
    colorInputText: "#ffffff",
    borderRadius: "10px",
  },
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Animated Particle Background */}
      <AnimatedBackground />

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Sign Up Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <SignUp appearance={clerkAppearance} />
      </div>
    </div>
  );
}
