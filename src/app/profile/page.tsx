"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ScreenContainer from "@/components/layout/ScreenContainer";
import PageTransition from "@/components/layout/PageTransition";
import BottomNav from "@/components/layout/BottomNav";
import TextInput from "@/components/ui/TextInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import type { UserProfile } from "@/types";
import {
  isAuthenticated,
  getMe,
  updateMe,
  logout,
  getCachedUser,
  ApiClientError,
} from "@/lib/apiClient";

const AVATAR_COLORS = [
  "#c9a227",
  "#3B82F6",
  "#EC4899",
  "#10B981",
  "#6366F1",
  "#F43F5E",
  "#8B5CF6",
  "#14B8A6",
  "#e67e22",
  "#64748B",
];

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [color, setColor] = useState("#c9a227");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState("u1");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    // まずキャッシュから即座に表示し、API からも取得して更新
    const cached = getCachedUser();
    if (cached) {
      setName(cached.name);
      setEmail(cached.email);
      setColor(cached.color);
      setAvatarUrl(cached.avatarUrl);
      setUserId(cached.id);
    }

    getMe()
      .then((user) => {
        setName(user.name);
        setEmail(user.email);
        setColor(user.color);
        setAvatarUrl(user.avatarUrl);
        setUserId(user.id);
        setIsReady(true);
      })
      .catch(() => {
        // API 失敗してもキャッシュがあれば表示
        if (cached) {
          setIsReady(true);
        } else {
          router.replace("/login");
        }
      });

    // キャッシュがあれば先に表示
    if (cached) setIsReady(true);
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("画像ファイルを選択してください");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("5MB以下の画像を選択してください");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        setAvatarUrl(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(undefined);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("名前を入力してください");
      return;
    }
    if (!email.trim()) {
      toast.error("メールアドレスを入力してください");
      return;
    }
    setSaving(true);
    try {
      const updated: UserProfile = {
        id: userId,
        name: name.trim(),
        email: email.trim(),
        color,
        avatarUrl,
      };
      await updateMe(updated);
      toast.success("プロフィールを更新しました");
    } catch (e) {
      if (e instanceof ApiClientError) {
        toast.error(e.message);
      } else {
        toast.error("更新に失敗しました");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("ログアウトしました");
    router.push("/home");
  };

  if (!isReady) return null;

  return (
    <ScreenContainer>
      <PageTransition className="flex flex-col items-center w-full flex-1 pb-20">
        <p
          className="text-4xl text-[#2d2a26] dark:text-[#eae7e1] pb-6"
          style={{ fontFamily: "var(--font-dancing-script), cursive" }}
        >
          Share Wallet
        </p>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative w-28 h-28 rounded-full overflow-hidden shadow-lg group transition-transform duration-150 active:scale-95"
          style={{ backgroundColor: avatarUrl ? undefined : color }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="アバター" className="w-full h-full object-cover" />
          ) : (
            <span className="flex items-center justify-center w-full h-full text-5xl font-bold text-white">
              {name ? name.charAt(0) : "?"}
            </span>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg viewBox="0 0 24 24" fill="white" width={28} height={28}>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#c9a227] border-2 border-white dark:border-[#111110] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" width={16} height={16}>
              <path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" />
              <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
            </svg>
          </div>
        </button>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        {avatarUrl && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            className="text-sm text-red-500 dark:text-red-400 mt-2 underline hover:text-red-600"
          >
            写真を削除
          </button>
        )}

        <p className="text-lg font-bold text-[#2d2a26] dark:text-[#eae7e1] mt-3">
          {name || "未設定"}
        </p>
        <p className="text-sm text-[#7a756d] dark:text-[#9e9a93]">
          {email || "未設定"}
        </p>

        <div className="w-full border-t border-[#e5e0d8] dark:border-[#333230] my-6" />

        <h2 className="text-lg font-bold text-[#2d2a26] dark:text-[#eae7e1] w-full mb-4">
          プロフィール編集
        </h2>

        <div className="flex flex-col gap-5 w-full">
          <TextInput label="名前" type="text" placeholder="名前を入力" value={name} onChange={setName} />
          <TextInput label="メールアドレス" type="email" placeholder="example@example.com" value={email} onChange={setEmail} />

          <div>
            <p className="text-base font-medium text-[#4a4540] dark:text-[#c5c0b8] mb-1">
              アイコンの色
            </p>
            <p className="text-xs text-[#9e9a93] dark:text-[#666360] mb-3">
              写真を設定していない場合に表示されます
            </p>
            <div className="flex flex-wrap gap-3">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={[
                    "w-10 h-10 rounded-full transition-all duration-150",
                    color === c
                      ? "ring-3 ring-offset-2 ring-[#c9a227] scale-110"
                      : "hover:scale-105",
                  ].join(" ")}
                  style={{ backgroundColor: c }}
                  aria-label={`色 ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-2">
            <PrimaryButton onClick={handleSave} loading={saving}>
              保存する
            </PrimaryButton>
          </div>
        </div>

        <div className="w-full mt-8">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-13 rounded-xl border-2 border-red-300 dark:border-red-700 text-red-500 dark:text-red-400 font-semibold text-base hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150 active:scale-[0.98]"
          >
            ログアウト
          </button>
        </div>
      </PageTransition>

      <BottomNav />
    </ScreenContainer>
  );
}
