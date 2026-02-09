"use client";

import Link from "next/link";
import ScreenContainer from "@/components/layout/ScreenContainer";
import PageTransition from "@/components/layout/PageTransition";
import Logo from "@/components/ui/Logo";
import CoinIcon from "@/components/ui/CoinIcon";

const buttonClassName = [
  "w-full h-14 rounded-full font-semibold text-lg text-white",
  "shadow-md hover:shadow-lg",
  "transition-all duration-150 ease-out",
  "hover:brightness-105 active:scale-[0.97] active:shadow-inner",
  "flex items-center justify-center",
  "relative overflow-hidden",
].join(" ");

export default function HomePage() {
  return (
    <ScreenContainer>
      <PageTransition className="flex flex-col items-center w-full flex-1">
        <div className="flex-1 flex items-center justify-center w-full">
          <Logo size={140} showScriptText={true} />
        </div>

        <div className="flex flex-col gap-5 w-full pb-4">
          <Link
            href="/login"
            className={buttonClassName}
            style={{
              background: "linear-gradient(135deg, #d4a320 0%, #e8c547 50%, #c9a227 100%)",
            }}
            aria-label="ログイン画面へ"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className={buttonClassName}
            style={{
              background: "linear-gradient(135deg, #d4a320 0%, #e8c547 50%, #c9a227 100%)",
            }}
            aria-label="新規登録画面へ"
          >
            新規登録
          </Link>
        </div>

        <footer className="py-4 flex justify-center">
          <CoinIcon size="md" />
        </footer>
      </PageTransition>
    </ScreenContainer>
  );
}
