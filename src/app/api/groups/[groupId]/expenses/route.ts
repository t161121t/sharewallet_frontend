import { NextRequest, NextResponse } from "next/server";
import type { ExpenseRecord, ApiError } from "@/types";
import { MOCK_EXPENSES } from "@/lib/mockData";

/** 認証チェック */
function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  return !!auth && auth.startsWith("Bearer ");
}

/** GET /api/groups/[groupId]/expenses - 支出一覧取得 */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json<ApiError>(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  return NextResponse.json<ExpenseRecord[]>(MOCK_EXPENSES);
}

/** POST /api/groups/[groupId]/expenses - 支出登録 */
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json<ApiError>(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);

  if (!body || !body.category || !body.amount) {
    return NextResponse.json<ApiError>(
      { error: "カテゴリと金額は必須です" },
      { status: 400 }
    );
  }

  // モック: 新しい支出レコードを作成して返す
  const newExpense: ExpenseRecord = {
    id: `e-${Date.now()}`,
    category: body.category,
    amount: body.amount,
    memberId: body.memberId ?? "u1",
    memberName: body.memberName ?? "田中",
    memo: body.memo,
    date: new Date().toISOString(),
  };

  return NextResponse.json<ExpenseRecord>(newExpense, { status: 201 });
}
