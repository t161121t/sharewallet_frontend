"use client";

import { useState } from "react";
import Link from "next/link";
import ScreenContainer from "@/components/layout/ScreenContainer";
import Logo from "@/components/ui/Logo";
import TextInput from "@/components/ui/TextInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import CoinIcon from "@/components/ui/CoinIcon";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log({ name, email, password });
  };

  return (
    <ScreenContainer>
      <div className="flex flex-col items-center w-full flex-1 min-h-0">
        <Logo />

        <div className="flex flex-col gap-4 w-full mt-10">
          <TextInput
            label="名前"
            type="text"
            placeholder="名前を入力"
            value={name}
            onChange={setName}
          />
          <TextInput
            label="メールアドレス"
            type="text"
            placeholder="example@example.com"
            value={email}
            onChange={setEmail}
          />
          <TextInput
            label="パスワード"
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={setPassword}
          />

          <PrimaryButton onClick={handleRegister}>新規登録</PrimaryButton>

          <p className="text-center text-sm text-gray-600 mt-2">
            <Link
              href="/login"
              className="underline hover:text-gray-800"
              aria-label="ログイン画面へ"
            >
              ログインはこちら
            </Link>
          </p>
        </div>

        <footer className="mt-auto pt-8 flex justify-center">
          <CoinIcon size="sm" />
        </footer>
      </div>
    </ScreenContainer>
  );
}
