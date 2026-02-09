"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ScreenContainer from "@/components/layout/ScreenContainer";
import PageTransition from "@/components/layout/PageTransition";
import Logo from "@/components/ui/Logo";
import TextInput from "@/components/ui/TextInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import CoinIcon from "@/components/ui/CoinIcon";
import { MOCK_GROUP, saveGroup } from "@/lib/mockGroup";
import { MOCK_USER, saveUser } from "@/lib/mockUser";

const AUTH_KEY = "sharewallet_logged_in";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = "メールアドレスを入力してください";
    if (!password.trim()) newErrors.password = "パスワードを入力してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_KEY, "1");
      saveGroup(MOCK_GROUP);
      saveUser(MOCK_USER);
    }
    toast.success("ログインしました");
    router.push("/dashboard");
  };

  return (
    <ScreenContainer>
      <PageTransition className="flex flex-col items-center w-full flex-1">
        {/* ロゴ */}
        <div className="pt-4 pb-8">
          <Logo size={100} showScriptText={true} />
        </div>

        {/* フォーム */}
        <div className="flex flex-col gap-5 w-full flex-1">
          <TextInput
            label="メールアドレス"
            type="text"
            placeholder="example@example.com"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
            }}
            error={errors.email}
          />
          <TextInput
            label="パスワード"
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(v) => {
              setPassword(v);
              if (errors.password)
                setErrors((e) => ({ ...e, password: undefined }));
            }}
            error={errors.password}
          />

          <div className="pt-2">
            <PrimaryButton onClick={handleLogin} loading={loading}>
              ログイン
            </PrimaryButton>
          </div>

          <p className="text-center text-base text-[#7a756d] dark:text-[#9e9a93] mt-1">
            <Link
              href="/register"
              className="underline hover:text-[#2d2a26] dark:hover:text-[#eae7e1] transition-colors duration-150"
              aria-label="新規登録画面へ"
            >
              新規登録はこちら
            </Link>
          </p>
        </div>

        <footer className="py-4 flex justify-center mt-auto">
          <CoinIcon size="md" />
        </footer>
      </PageTransition>
    </ScreenContainer>
  );
}
