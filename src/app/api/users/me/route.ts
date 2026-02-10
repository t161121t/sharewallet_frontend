import { NextRequest, NextResponse } from "next/server";
import type { UserProfile, ApiError } from "@/types";
import { MOCK_USER } from "@/lib/mockData";

/** 認証チェック（モック: トークンがあれば OK） */
function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  return !!auth && auth.startsWith("Bearer ");
}

/** GET /api/users/me - ユーザープロフィール取得 */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json<ApiError>(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  return NextResponse.json<UserProfile>(MOCK_USER);
}

/** PUT /api/users/me - ユーザープロフィール更新 */
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json<ApiError>(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json<ApiError>(
      { error: "リクエストボディが不正です" },
      { status: 400 }
    );
  }

  // モック: 受け取った値をそのまま返す（MOCK_USER をベースにマージ）
  const updated: UserProfile = {
    ...MOCK_USER,
    ...body,
    id: MOCK_USER.id, // ID は変更不可
  };

  return NextResponse.json<UserProfile>(updated);
}
