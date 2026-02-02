import Link from "next/link";
import ScreenContainer from "@/components/layout/ScreenContainer";
import Logo from "@/components/ui/Logo";
import CoinIcon from "@/components/ui/CoinIcon";

const buttonClassName =
  "w-full h-11 rounded-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 text-white font-medium shadow-sm active:scale-[0.99] flex items-center justify-center";

export default function HomePage() {
  return (
    <ScreenContainer>
      <div className="flex flex-col items-center w-full flex-1 min-h-0">
        <Logo />

        <div className="flex flex-col gap-4 w-full mt-10">
          <Link
            href="/login"
            className={buttonClassName}
            aria-label="ログイン画面へ"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className={buttonClassName}
            aria-label="新規登録画面へ"
          >
            新規登録
          </Link>
        </div>

        <footer className="mt-auto pt-8 flex justify-center">
          <CoinIcon size="sm" />
        </footer>
      </div>
    </ScreenContainer>
  );
}
