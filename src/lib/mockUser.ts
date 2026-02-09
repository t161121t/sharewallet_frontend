/** ユーザープロフィールの型 */
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  color: string;
  /** アバター画像（Data URL） */
  avatarUrl?: string;
};

/** モックユーザー */
export const MOCK_USER: UserProfile = {
  id: "u1",
  name: "田中 太郎",
  email: "tanaka@example.com",
  color: "#F59E0B",
};

const STORAGE_KEY = "sharewallet_user";

/** ユーザー情報を localStorage に保存 */
export function saveUser(user: UserProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

/** ユーザー情報を localStorage から取得 */
export function loadUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}
