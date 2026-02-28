"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ScreenContainer from "@/components/layout/ScreenContainer";
import PageTransition from "@/components/layout/PageTransition";
import TextInput from "@/components/ui/TextInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { ApiClientError, createGroup, setSelectedGroupId } from "@/lib/apiClient";

export default function NewGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#c9a227");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("グループ名を入力してください");
      return;
    }
    setLoading(true);
    try {
      const group = await createGroup({ name: name.trim(), color });
      setSelectedGroupId(group.id);
      toast.success("グループを作成しました");
      router.push("/dashboard");
    } catch (e) {
      if (e instanceof ApiClientError) {
        toast.error(e.message);
      } else {
        toast.error("グループ作成に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <PageTransition className="flex flex-col w-full gap-5">
        <h1 className="text-2xl font-bold text-[#2d2a26] dark:text-[#eae7e1]">
          グループ作成
        </h1>
        <TextInput
          label="グループ名"
          placeholder="例: 旅行メンバー"
          value={name}
          onChange={setName}
        />
        <label className="w-full">
          <div className="text-base font-medium text-[#4a4540] dark:text-[#c5c0b8] mb-2">
            テーマカラー
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-12 w-24 rounded-lg"
          />
        </label>
        <PrimaryButton onClick={handleCreate} loading={loading}>
          作成する
        </PrimaryButton>
      </PageTransition>
    </ScreenContainer>
  );
}
