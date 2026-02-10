import { NextRequest, NextResponse } from "next/server";
import type { LoginResponse, ApiError } from "@/types";
import { MOCK_USER } from "@/lib/mockData";

const MOCK_TOKEN = "mock-jwt-token-sharewallet-2026";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || !body.email || !body.password) {
    return NextResponse.json<ApiError>(
      { error: "メールアドレスとパスワードを入力してください" },
      { status: 400 }
    );
  }

  // モック: どんな認証情報でもログイン成功
  return NextResponse.json<LoginResponse>({
    token: MOCK_TOKEN,
    user: MOCK_USER,
  });
}
