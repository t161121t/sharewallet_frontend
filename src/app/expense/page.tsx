"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ScreenContainer from "@/components/layout/ScreenContainer";
import PageTransition from "@/components/layout/PageTransition";
import BottomNav from "@/components/layout/BottomNav";
import GroupBanner from "@/components/ui/GroupBanner";
import ExpensePieChart from "@/components/ui/ExpensePieChart";
import GenreSelect from "@/components/ui/GenreSelect";
import PrimaryButton from "@/components/ui/PrimaryButton";
import type { Group, CategoryName } from "@/types";
import {
  isAuthenticated,
  getSelectedGroupId,
  getGroup,
  createExpense,
  ApiClientError,
} from "@/lib/apiClient";

export default function ExpensePage() {
  const router = useRouter();
  const [genre, setGenre] = useState("");
  const [amount, setAmount] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const groupId = getSelectedGroupId();
    if (!groupId) {
      router.replace("/dashboard");
      return;
    }

    // API からグループ情報を取得
    getGroup(groupId)
      .then((data) => {
        setGroup(data);
        setIsReady(true);
      })
      .catch(() => {
        router.replace("/dashboard");
      });
  }, [router]);

  const handleRegister = async () => {
    if (!genre || !amount) {
      toast.error("ジャンルと金額を入力してください");
      return;
    }
    if (!group) return;

    setLoading(true);
    try {
      await createExpense(group.id, {
        category: genre as CategoryName,
        amount: Number(amount),
        memo: "",
      });
      toast.success("支出を登録しました");
      setGenre("");
      setAmount("");
    } catch (e) {
      if (e instanceof ApiClientError) {
        toast.error(e.message);
      } else {
        toast.error("登録に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isReady || !group) return null;

  return (
    <ScreenContainer>
      <PageTransition className="flex flex-col items-center w-full flex-1 pb-20">
        {/* アプリ名 */}
        <p
          className="text-4xl text-[#2d2a26] dark:text-[#eae7e1] pb-3"
          style={{ fontFamily: "var(--font-dancing-script), cursive" }}
        >
          Share Wallet
        </p>

        {/* グループバナー */}
        <div className="w-full">
          <GroupBanner group={group} />
        </div>

        {/* ページタイトル */}
        <h1 className="text-xl font-bold text-[#2d2a26] dark:text-[#eae7e1] w-full text-center mt-5">
          共有金額入力
        </h1>

        {/* 円グラフ + 凡例 */}
        <div className="w-full mt-3">
          <ExpensePieChart size={200} />
        </div>

        {/* 入力フォーム */}
        <div className="flex flex-col gap-4 w-full mt-5">
          <GenreSelect value={genre} onChange={setGenre} />

          <label className="w-full">
            <div className="text-base font-medium text-[#4a4540] dark:text-[#c5c0b8] mb-2">
              使った金額
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="使った金額"
              value={amount === "" ? "" : `${amount}円`}
              onChange={(e) => {
                const v = e.target.value.replace(/[^\d]/g, "");
                setAmount(v);
              }}
              className={[
                "w-full h-13 rounded-xl px-4 outline-none text-base",
                "bg-white dark:bg-[#1c1b19] border border-[#e5e0d8] dark:border-[#333230]",
                "text-[#2d2a26] dark:text-[#eae7e1]",
                "placeholder:text-[#b5b0a8] dark:placeholder:text-[#666360]",
                "transition-all duration-200 ease-out",
                "focus:ring-2 focus:ring-[#c9a227] focus:border-[#c9a227]",
              ].join(" ")}
              aria-label="使った金額を入力"
            />
          </label>

          <div className="pt-1">
            <PrimaryButton onClick={handleRegister} loading={loading}>
              登録
            </PrimaryButton>
          </div>
        </div>
      </PageTransition>

      <BottomNav />
    </ScreenContainer>
  );
}
