type HeartWalletLogoProps = {
  size?: number;
  className?: string;
};

const DEFAULT_SIZE = 112; // h-28 w-28 = 112px

export default function HeartWalletLogo({
  size = DEFAULT_SIZE,
  className = "",
}: HeartWalletLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="heart-wallet-gradient"
          x1="2"
          y1="2"
          x2="22"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F7DC6F" />
          <stop offset="0.4" stopColor="#E8C547" />
          <stop offset="0.7" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      {/* ハートの輪郭 */}
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="url(#heart-wallet-gradient)"
        stroke="#B8860B"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* 左側の財布（簡略化した財布シルエット） */}
      <g transform="translate(5, 8.5)">
        <rect
          x="0.5"
          y="1"
          width="4"
          height="5"
          rx="0.6"
          fill="#8B6914"
          stroke="#B8860B"
          strokeWidth="0.4"
        />
        <path
          d="M1 2.2 L4.5 2.2"
          stroke="#D4AF37"
          strokeWidth="0.35"
          strokeLinecap="round"
        />
      </g>
      {/* 右側の財布 */}
      <g transform="translate(14.5, 8.5)">
        <rect
          x="0.5"
          y="1"
          width="4"
          height="5"
          rx="0.6"
          fill="#8B6914"
          stroke="#B8860B"
          strokeWidth="0.4"
        />
        <path
          d="M1 2.2 L4.5 2.2"
          stroke="#D4AF37"
          strokeWidth="0.35"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
