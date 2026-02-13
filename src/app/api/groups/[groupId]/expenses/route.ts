import { NextRequest, NextResponse } from "next/server";
import type { ExpenseRecord, ApiError } from "@/types";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

/** GET /api/groups/[groupId]/expenses - 支出一覧取得 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json<ApiError>(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  const { groupId } = await params;

  const expenses = await prisma.expense.findMany({
    where: { groupId },
    include: {
      member: { select: { id: true, name: true } },
    },
    orderBy: { date: "desc" },
  });

  const result: ExpenseRecord[] = expenses.map((e) => ({
    id: e.id,
    category: e.category as ExpenseRecord["category"],
    amount: e.amount,
    memberId: e.member.id,
    memberName: e.member.name,
    memo: e.memo ?? undefined,
    date: e.date.toISOString(),
  }));

  return NextResponse.json<ExpenseRecord[]>(result);
}

/** POST /api/groups/[groupId]/expenses - 支出登録 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json<ApiError>(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  const { groupId } = await params;
  const body = await req.json().catch(() => null);

  if (!body || !body.category || !body.amount) {
    return NextResponse.json<ApiError>(
      { error: "カテゴリと金額は必須です" },
      { status: 400 }
    );
  }

  const expense = await prisma.expense.create({
    data: {
      groupId,
      memberId: userId,
      category: body.category,
      amount: body.amount,
      memo: body.memo ?? null,
      date: new Date(),
    },
    include: {
      member: { select: { id: true, name: true } },
    },
  });

  const result: ExpenseRecord = {
    id: expense.id,
    category: expense.category as ExpenseRecord["category"],
    amount: expense.amount,
    memberId: expense.member.id,
    memberName: expense.member.name,
    memo: expense.memo ?? undefined,
    date: expense.date.toISOString(),
  };

  return NextResponse.json<ExpenseRecord>(result, { status: 201 });
}
