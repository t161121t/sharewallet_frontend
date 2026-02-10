import { NextRequest, NextResponse } from "next/server";
import type { RegisterResponse, ApiError } from "@/types";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || !body.name || !body.email || !body.password) {
    return NextResponse.json<ApiError>(
      { error: "名前、メールアドレス、パスワードを入力してください" },
      { status: 400 }
    );
  }

  // モック: 常に登録成功
  return NextResponse.json<RegisterResponse>({
    user: {
      id: `u-${Date.now()}`,
      name: body.name,
      email: body.email,
      color: "#c9a227",
    },
  });
}
