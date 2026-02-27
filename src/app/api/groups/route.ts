import { NextRequest, NextResponse } from "next/server";
import type { Group, ApiError } from "@/types";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

/** GET /api/groups - グループ一覧取得 */
export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json<ApiError>(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  const groups = await prisma.group.findMany({
    where: {
      members: { some: { userId } },
    },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, color: true } },
        },
      },
    },
  });

  // レスポンス形状を既存の Group 型に合わせて整形
  const result: Group[] = groups.map((g) => ({
    id: g.id,
    name: g.name,
    color: g.color,
    members: g.members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      color: m.user.color,
    })),
  }));

  return NextResponse.json<Group[]>(result);
}
