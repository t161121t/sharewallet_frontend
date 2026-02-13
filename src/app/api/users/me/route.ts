import { NextRequest, NextResponse } from "next/server";
import type { UserProfile, ApiError } from "@/types";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

/** GET /api/users/me - ユーザープロフィール取得 */
export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json<ApiError>(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json<ApiError>(
      { error: "ユーザーが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json<UserProfile>({
    id: user.id,
    name: user.name,
    email: user.email,
    color: user.color,
    avatarUrl: user.avatarUrl ?? undefined,
  });
}

/** PUT /api/users/me - ユーザープロフィール更新 */
export async function PUT(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) {
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

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.color !== undefined && { color: body.color }),
      ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
    },
  });

  return NextResponse.json<UserProfile>({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    color: updated.color,
    avatarUrl: updated.avatarUrl ?? undefined,
  });
}
