import type { SVGProps } from "react";

export type CategoryName =
  | "貯金"
  | "住居"
  | "交通"
  | "食費"
  | "娯楽"
  | "その他";

type CategoryIconProps = SVGProps<SVGSVGElement> & {
  /** カテゴリ名 */
  category: CategoryName;
  /** px サイズ（width = height） */
  size?: number;
};

/* ---------- 各カテゴリの SVG path ---------- */

function SavingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15.5 2A4.5 4.5 0 0011 6.5c0 .66.15 1.29.41 1.85L4 15.77V22h4v-2h2v-2h2l2.79-2.79c.56.26 1.19.41 1.85.41.07 0 .14 0 .21-.01A4.49 4.49 0 0020 11a4.5 4.5 0 00-4.5-4.5zm.5 6a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );
}

function HousingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function TransportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  );
}

function FoodIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
    </svg>
  );
}

function EntertainmentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

function OtherIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
    </svg>
  );
}

/* ---------- カテゴリ → コンポーネント マップ ---------- */

const ICON_MAP: Record<CategoryName, (props: SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  貯金: SavingsIcon,
  住居: HousingIcon,
  交通: TransportIcon,
  食費: FoodIcon,
  娯楽: EntertainmentIcon,
  その他: OtherIcon,
};

/**
 * カテゴリ名からアイコンを描画する汎用コンポーネント。
 *
 * @example
 * <CategoryIcon category="食費" size={20} className="text-red-500" />
 */
export default function CategoryIcon({
  category,
  size = 20,
  ...rest
}: CategoryIconProps) {
  const Icon = ICON_MAP[category] ?? OtherIcon;
  return <Icon width={size} height={size} aria-hidden {...rest} />;
}
