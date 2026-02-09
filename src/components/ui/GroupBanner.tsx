"use client";

import type { Group } from "@/lib/mockGroup";

type GroupBannerProps = {
  group: Group;
};

/** テーマカラーから薄い背景色を生成 */
function lightBg(hex: string, opacity = 0.10) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export default function GroupBanner({ group }: GroupBannerProps) {
  const c = group.color;

  return (
    <div
      className="w-full rounded-2xl px-5 py-4 border"
      style={{
        backgroundColor: lightBg(c, 0.08),
        borderColor: lightBg(c, 0.20),
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: c }}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="white" aria-hidden>
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: c }}
          >
            グループ
          </span>
          <span className="text-lg font-bold text-[#2d2a26] dark:text-[#eae7e1] truncate">
            {group.name}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <div className="flex -space-x-2">
          {group.members.map((member) => (
            <div
              key={member.id}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{
                backgroundColor: member.color,
                borderColor: lightBg(c, 0.08),
              }}
              title={member.name}
            >
              {member.name.charAt(0)}
            </div>
          ))}
        </div>
        <span className="text-sm text-[#7a756d] dark:text-[#9e9a93] ml-1">
          {group.members.length}人のメンバー
        </span>
      </div>
    </div>
  );
}
