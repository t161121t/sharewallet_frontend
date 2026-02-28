"use client";

import ScreenContainer from "@/components/layout/ScreenContainer";
import PageTransition from "@/components/layout/PageTransition";
import BottomNav from "@/components/layout/BottomNav";

type RouteLoadingProps = {
  text?: string;
  withBottomNav?: boolean;
};

export default function RouteLoading({
  text = "読み込み中...",
  withBottomNav = false,
}: RouteLoadingProps) {
  return (
    <ScreenContainer>
      <PageTransition className="flex flex-col items-center justify-center w-full flex-1 pb-20">
        <div className="w-8 h-8 rounded-full border-2 border-[#e5e0d8] border-t-[#c9a227] animate-spin" />
        <p className="mt-3 text-sm text-[#7a756d] dark:text-[#9e9a93]">{text}</p>
      </PageTransition>
      {withBottomNav && <BottomNav />}
    </ScreenContainer>
  );
}
