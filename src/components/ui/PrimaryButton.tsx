import { ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const baseClassName = [
  "relative w-full h-13 rounded-full font-semibold text-white text-base tracking-wide",
  "shadow-md hover:shadow-lg",
  "transition-all duration-150 ease-out",
  "hover:brightness-105 active:scale-[0.97] active:shadow-inner",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "overflow-hidden",
].join(" ");

export default function PrimaryButton({
  className = "",
  loading = false,
  children,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={[baseClassName, className].filter(Boolean).join(" ")}
      disabled={disabled || loading}
      style={{
        background: "linear-gradient(135deg, #d4a320 0%, #e8c547 50%, #c9a227 100%)",
      }}
      {...props}
    >
      {/* Shimmer overlay */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />
      <span className="relative flex items-center justify-center gap-2">
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </span>
    </button>
  );
}
