import type { SVGProps } from "react";

type ShareWalletLogoProps = SVGProps<SVGSVGElement> & {
  /** アイコン部分のサイズ (px) */
  size?: number;
  /** "ShareWallet" テキストを表示するか */
  showText?: boolean;
};

/**
 * ハート型財布ロゴ（SVG）
 *
 * 2つの財布がハートの形に合体したデザイン。
 * sharewallet-logo.png を参考に SVG で再現。
 */
export default function ShareWalletLogo({
  size = 120,
  showText = false,
  ...rest
}: ShareWalletLogoProps) {
  const textHeight = showText ? 32 : 0;
  const totalHeight = size + (showText ? 8 + textHeight : 0);

  return (
    <svg
      width={size}
      height={totalHeight}
      viewBox={`0 0 120 ${showText ? 156 : 120}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ShareWallet ロゴ"
      {...rest}
    >
      <defs>
        {/* メインのゴールドグラデーション */}
        <linearGradient id="sw-gold" x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F7DC6F" />
          <stop offset="0.35" stopColor="#D4AF37" />
          <stop offset="0.7" stopColor="#C9A227" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
        {/* ハイライト用 */}
        <linearGradient id="sw-highlight" x1="30" y1="15" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FBE88A" stopOpacity="0.6" />
          <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* === ハート型の外形 === */}
      <path
        d="
          M60 108
          L16 62
          C4 48 4 28 18 16
          C28 8 42 8 52 18
          L60 28
          L68 18
          C78 8 92 8 102 16
          C116 28 116 48 104 62
          Z
        "
        fill="url(#sw-gold)"
        stroke="#A07D1C"
        strokeWidth="1.5"
      />

      {/* ハイライト */}
      <path
        d="
          M60 108
          L16 62
          C4 48 4 28 18 16
          C28 8 42 8 52 18
          L60 28
          L68 18
          C78 8 92 8 102 16
          C116 28 116 48 104 62
          Z
        "
        fill="url(#sw-highlight)"
      />

      {/* === 左の財布フタ（フラップ） === */}
      <path
        d="M22 36 L56 36 L56 30 C56 26 50 22 44 22 L34 22 C28 22 22 26 22 30 Z"
        fill="#C9A227"
        stroke="#A07D1C"
        strokeWidth="0.8"
      />
      {/* 左フラップのライン */}
      <line x1="26" y1="32" x2="52" y2="32" stroke="white" strokeWidth="1.2" strokeOpacity="0.5" />

      {/* === 右の財布フタ（フラップ） === */}
      <path
        d="M64 36 L98 36 L98 30 C98 26 92 22 86 22 L76 22 C70 22 64 26 64 30 Z"
        fill="#C9A227"
        stroke="#A07D1C"
        strokeWidth="0.8"
      />
      {/* 右フラップのライン */}
      <line x1="68" y1="32" x2="94" y2="32" stroke="white" strokeWidth="1.2" strokeOpacity="0.5" />

      {/* === 財布の本体部分のライン === */}
      {/* 中央の分割線 */}
      <line x1="60" y1="28" x2="60" y2="90" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />

      {/* 左の財布ポケット */}
      <path
        d="M24 42 L54 42 L54 60 L24 60 Z"
        fill="none"
        stroke="white"
        strokeWidth="1"
        strokeOpacity="0.35"
        rx="2"
      />

      {/* 右の財布ポケット */}
      <path
        d="M66 42 L96 42 L96 60 L66 60 Z"
        fill="none"
        stroke="white"
        strokeWidth="1"
        strokeOpacity="0.35"
        rx="2"
      />

      {/* === 留め具（左） === */}
      <circle cx="24" cy="52" r="4" fill="#B8860B" stroke="#A07D1C" strokeWidth="0.6" />
      <circle cx="24" cy="52" r="2" fill="#D4AF37" />

      {/* === 留め具（右） === */}
      <circle cx="96" cy="52" r="4" fill="#B8860B" stroke="#A07D1C" strokeWidth="0.6" />
      <circle cx="96" cy="52" r="2" fill="#D4AF37" />

      {/* === 中央のコイン === */}
      <circle cx="60" cy="78" r="10" fill="#B8860B" stroke="#8B6914" strokeWidth="1" />
      <circle cx="60" cy="78" r="7" fill="#D4AF37" />
      <circle cx="60" cy="78" r="4" fill="#E8C547" opacity="0.8" />
      {/* コインの ¥ マーク */}
      <text
        x="60"
        y="78"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#8B6914"
        style={{ fontSize: 8, fontWeight: 700 }}
      >
        ¥
      </text>

      {/* === "ShareWallet" テキスト === */}
      {showText && (
        <text
          x="60"
          y="142"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#3D3D3D"
          style={{
            fontSize: 16,
            fontWeight: 600,
            fontFamily: "'Geist Sans', system-ui, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          ShareWallet
        </text>
      )}
    </svg>
  );
}
