"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ScreenContainer from "@/components/layout/ScreenContainer";
import PageTransition from "@/components/layout/PageTransition";
import BottomNav from "@/components/layout/BottomNav";
import RouteLoading from "@/components/layout/RouteLoading";
import Logo from "@/components/ui/Logo";
import type { Group } from "@/types";
import {
  isAuthenticated,
  getGroups,
  getSelectedGroupId,
  setSelectedGroupId,
} from "@/lib/apiClient";

/** テーマカラーから薄い背景色を生成 */
function lightBg(hex: string, opacity = 0.10) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    // API からグループ一覧を取得
    getGroups()
      .then((data) => {
        setGroups(data);
        const savedId = getSelectedGroupId();
        if (savedId && data.some((g) => g.id === savedId)) {
          setSelectedId(savedId);
        }
        setIsReady(true);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  const handleSelect = (group: Group) => {
    setSelectedGroupId(group.id);
    setSelectedId(group.id);
  };

  if (!isReady) return <RouteLoading text="グループを読み込み中..." withBottomNav />;

  return (
    <ScreenContainer>
      <PageTransition className="flex flex-col items-center w-full flex-1 pb-20">
        <div className="pt-2 pb-6">
          <Logo size={100} showScriptText={true} />
        </div>

        <h1 className="text-xl font-bold text-[#2d2a26] dark:text-[#eae7e1] w-full">
          グループを選択
        </h1>
        <p className="text-sm text-[#7a756d] dark:text-[#9e9a93] w-full mt-1 mb-5">
          家計簿を共有するグループを選んでください
        </p>

        <div className="w-full mb-4">
          <Link
            href="/groups/new"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-[#c9a227] hover:brightness-105"
          >
            + グループ作成
          </Link>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {groups.map((group) => {
            const isSelected = group.id === selectedId;
            const c = group.color;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => handleSelect(group)}
                className={[
                  "w-full text-left rounded-2xl p-5 transition-all duration-150",
                  "border-2",
                  "active:scale-[0.98]",
                ].join(" ")}
                style={{
                  borderColor: isSelected ? c : "transparent",
                  backgroundColor: lightBg(c, isSelected ? 0.12 : 0.05),
                  boxShadow: isSelected ? `0 4px 16px ${lightBg(c, 0.20)}` : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* グループアイコン */}
                  <div
                    className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: c }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" width={22} height={22}>
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-[#2d2a26] dark:text-[#eae7e1] truncate">
                      {group.name}
                    </p>
                    <p className="text-sm text-[#7a756d] dark:text-[#9e9a93]">
                      {group.members.length}人のメンバー
                    </p>
                  </div>

                  {/* 選択中チェック */}
                  {isSelected && (
                    <div
                      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: c }}
                    >
                      <svg viewBox="0 0 24 24" fill="white" width={18} height={18}>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* メンバーアバター */}
                <div className="flex items-center gap-1 mt-3 ml-14">
                  {group.members.map((m) => (
                    <div
                      key={m.id}
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white -ml-1 first:ml-0"
                      style={{
                        backgroundColor: m.color,
                        borderColor: lightBg(c, 0.12),
                      }}
                      title={m.name}
                    >
                      {m.name.charAt(0)}
                    </div>
                  ))}
                  <span className="text-xs text-[#9e9a93] dark:text-[#666360] ml-2">
                    {group.members.map((m) => m.name).join("・")}
                  </span>
                </div>

                <div className="mt-3 ml-14">
                  <Link
                    href={`/groups/${group.id}/settings`}
                    className="text-xs text-[#7a756d] dark:text-[#9e9a93] underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    グループ設定
                  </Link>
                </div>
              </button>
            );
          })}
        </div>
      </PageTransition>

      <BottomNav />
    </ScreenContainer>
  );
}
