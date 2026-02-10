import { NextRequest, NextResponse } from "next/server";
import type { Group, ApiError } from "@/types";
import { MOCK_GROUPS } from "@/lib/mockData";

/** 認証チェック */
function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  return !!auth && auth.startsWith("Bearer ");
}

/** GET /api/groups - グループ一覧取得 */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json<ApiError>(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  return NextResponse.json<Group[]>(MOCK_GROUPS);
}
