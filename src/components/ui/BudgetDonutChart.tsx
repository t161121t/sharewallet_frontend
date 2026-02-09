"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ダミーデータ：上部に細い2セグメント + SAVINGS / HOUSING / TRANSPORTATION / FOOD
const DUMMY_DATA = [
  { name: "Other1", value: 3, color: "#e2e8f0" },
  { name: "Other2", value: 2, color: "#cbd5e1" },
  { name: "SAVINGS", value: 35, color: "#22c55e" },
  { name: "HOUSING", value: 25, color: "#eab308" },
  { name: "TRANSPORTATION", value: 20, color: "#3b82f6" },
  { name: "FOOD", value: 15, color: "#ef4444" },
];

// セグメント内用アイコン（貯金・住宅・交通・食事）
const SEGMENT_ICONS: Record<string, React.ReactNode> = {
  SAVINGS: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-1.27-.99-2.13-3.66-2.77z" />
  ),
  HOUSING: (
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  ),
  TRANSPORTATION: (
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  ),
  FOOD: (
    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
  ),
};

// ラベル表示用（メイン4カテゴリ。右側で TRANSPORTATION が読めるように）
const SHOW_LABEL = new Set(["SAVINGS", "HOUSING", "TRANSPORTATION", "FOOD"]);

type LabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  name?: string;
  fill?: string;
  payload?: { color?: string };
};

function CustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  fill,
  payload,
}: LabelProps) {
  const RADIAN = Math.PI / 180;
  const segmentColor = fill ?? payload?.color ?? "#64748b";
  const cxVal = cx ?? 0;
  const cyVal = cy ?? 0;
  const midAngleVal = midAngle ?? 0;
  const innerVal = innerRadius ?? 0;
  const outerVal = outerRadius ?? 0;
  const r = (innerVal + outerVal) / 2;
  const x = cxVal + r * Math.cos(-midAngleVal * RADIAN);
  const y = cyVal + r * Math.sin(-midAngleVal * RADIAN);
  const isRight = midAngleVal < 90 || midAngleVal > 270;
  const textAnchor = isRight ? "start" : "end";
  const rotation = midAngleVal - (isRight ? 0 : 180);
  const iconSize = 12;
  const labelOffset = isRight ? iconSize + 4 : -(iconSize + 4);
  const labelName = name ?? "";

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      {/* アイコン（メイン4カテゴリのみ）セグメント内中央寄せ */}
      {SEGMENT_ICONS[labelName] && (
        <g transform={`translate(${-iconSize / 2}, ${-iconSize / 2})`} fill={segmentColor}>
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
            {SEGMENT_ICONS[labelName]}
          </svg>
        </g>
      )}
      {/* ラベル（メイン4カテゴリ）アイコンの横に配置 */}
      {SHOW_LABEL.has(labelName) && (
        <text
          x={labelOffset}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fill={segmentColor}
          style={{
            fontSize: 9,
            fontWeight: 600,
            fontFamily: "sans-serif",
          }}
        >
          {labelName}
        </text>
      )}
    </g>
  );
}

export type BudgetDonutChartProps = {
  data?: { name: string; value: number; color: string }[];
  width?: string | number;
  height?: number;
};

export default function BudgetDonutChart({
  data = DUMMY_DATA,
  width = "100%",
  height = 280,
}: BudgetDonutChartProps) {
  return (
    <ResponsiveContainer
      width={width as number | `${number}%`}
      height={height}
    >
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={1}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          nameKey="name"
          label={(props) => <CustomLabel {...props} />}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number | undefined, name: string | undefined) =>
            value != null && name != null ? [value, name] : [null, name ?? ""]
          }
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
