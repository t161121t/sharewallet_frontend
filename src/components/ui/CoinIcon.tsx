type CoinIconProps = {
  size?: "sm" | "md";
  className?: string;
  animate?: boolean;
};

const sizeMap = {
  sm: 24,
  md: 32,
};

export default function CoinIcon({
  size = "sm",
  className = "",
  animate = true,
}: CoinIconProps) {
  const px = sizeMap[size];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={animate ? { animation: "spin-slow 4s linear infinite" } : undefined}
      aria-hidden
    >
      {/* 外側の円（金貨の縁・光沢） */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#coin-gradient)"
        stroke="#B8860B"
        strokeWidth="1"
      />
      {/* 内側の円（中央の凹み・立体感） */}
      <circle cx="12" cy="12" r="7" fill="url(#coin-inner)" />
      {/* 中央の記号（円） */}
      <circle cx="12" cy="12" r="3" fill="#D4AF37" opacity="0.9" />
      <defs>
        <linearGradient
          id="coin-gradient"
          x1="4"
          y1="4"
          x2="20"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F7DC6F" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient
          id="coin-inner"
          x1="8"
          y1="8"
          x2="16"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E8C547" />
          <stop offset="1" stopColor="#C9A227" />
        </linearGradient>
      </defs>
    </svg>
  );
}
