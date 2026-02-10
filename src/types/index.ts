/** カテゴリ名 */
export type CategoryName = "貯金" | "住居" | "交通" | "食費" | "娯楽" | "その他";

/** グループメンバーの型 */
export type GroupMember = {
  id: string;
  name: string;
  /** アバターの色（背景色として使用） */
  color: string;
};

/** グループの型 */
export type Group = {
  id: string;
  name: string;
  members: GroupMember[];
  /** グループのテーマカラー */
  color: string;
};

/** ユーザープロフィールの型 */
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  color: string;
  /** アバター画像（Data URL） */
  avatarUrl?: string;
};

/** 支出レコードの型 */
export type ExpenseRecord = {
  id: string;
  /** カテゴリ */
  category: CategoryName;
  /** 金額（円） */
  amount: number;
  /** 登録したメンバーの ID */
  memberId: string;
  /** 登録したメンバーの名前 */
  memberName: string;
  /** メモ（任意） */
  memo?: string;
  /** 登録日時 ISO 文字列 */
  date: string;
};

/** ログインレスポンス */
export type LoginResponse = {
  token: string;
  user: UserProfile;
};

/** 登録レスポンス */
export type RegisterResponse = {
  user: UserProfile;
};

/** API エラーレスポンス */
export type ApiError = {
  error: string;
};
