import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { RegisterResponse, ApiError } from "@/types";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || !body.name || !body.email || !body.password) {
    return NextResponse.json<ApiError>(
      { error: "名前、メールアドレス、パスワードを入力してください" },
      { status: 400 }
    );
  }

  // email 重複チェック
  const existing = await prisma.user.findUnique({
    where: { email: body.email },
  });
  if (existing) {
    return NextResponse.json<ApiError>(
      { error: "このメールアドレスは既に登録されています" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash,
    },
  });

  return NextResponse.json<RegisterResponse>({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      color: user.color,
    },
  });
}
