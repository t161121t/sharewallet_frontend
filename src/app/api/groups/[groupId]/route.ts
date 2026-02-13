import { NextRequest, NextResponse } from "next/server";
import type { Group, ApiError } from "@/types";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

/** GET /api/groups/[groupId] - グループ詳細取得 */
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

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, color: true } },
        },
      },
    },
  });

  if (!group) {
    return NextResponse.json<ApiError>(
      { error: "グループが見つかりません" },
      { status: 404 }
    );
  }

  const result: Group = {
    id: group.id,
    name: group.name,
    color: group.color,
    members: group.members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      color: m.user.color,
    })),
  };

  return NextResponse.json<Group>(result);
}
