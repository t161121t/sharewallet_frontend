import { NextRequest, NextResponse } from "next/server";
import type { Group, ApiError } from "@/types";
import { MOCK_GROUPS } from "@/lib/mockData";

/** 認証チェック */
function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  return !!auth && auth.startsWith("Bearer ");
}

/** GET /api/groups/[groupId] - グループ詳細取得 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json<ApiError>(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  const { groupId } = await params;
  const group = MOCK_GROUPS.find((g) => g.id === groupId);

  if (!group) {
    return NextResponse.json<ApiError>(
      { error: "グループが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json<Group>(group);
}
