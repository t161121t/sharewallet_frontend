import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { GroupRole } from "@/generated/prisma/client";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-change-in-production"
);
const ALG = "HS256";

/** JWT トークン生成 */
export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

/** JWT トークン検証 → userId を返す。失敗時は null */
export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return (payload.sub as string) ?? null;
  } catch {
    return null;
  }
}

/** リクエストから認証ユーザー ID を取得 */
export async function getAuthUserId(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  return verifyToken(token);
}

export async function requireAuthUserId(req: NextRequest): Promise<string> {
  const userId = await getAuthUserId(req);
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }
  return userId;
}

export async function getGroupMember(groupId: string, userId: string) {
  return prisma.groupMember.findUnique({
    where: {
      userId_groupId: { userId, groupId },
    },
  });
}

export async function assertGroupMember(groupId: string, userId: string) {
  const member = await getGroupMember(groupId, userId);
  if (!member) {
    throw new Error("FORBIDDEN");
  }
  return member;
}

export async function assertGroupRole(
  groupId: string,
  userId: string,
  allowedRoles: GroupRole[]
) {
  const member = await assertGroupMember(groupId, userId);
  if (!allowedRoles.includes(member.role)) {
    throw new Error("FORBIDDEN");
  }
  return member;
}
