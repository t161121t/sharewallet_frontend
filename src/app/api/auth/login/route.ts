import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { LoginResponse, ApiError } from "@/types";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || !body.email || !body.password) {
    return NextResponse.json<ApiError>(
      { error: "メールアドレスとパスワードを入力してください" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    return NextResponse.json<ApiError>(
      { error: "メールアドレスまたはパスワードが正しくありません" },
      { status: 401 }
    );
  }

  const token = await createToken(user.id);

  return NextResponse.json<LoginResponse>({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      color: user.color,
      avatarUrl: user.avatarUrl ?? undefined,
    },
  });
}
