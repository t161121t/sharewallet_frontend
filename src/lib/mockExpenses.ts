import type { CategoryName } from "@/components/icons/CategoryIcon";

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

/** モック支出データ */
export const MOCK_EXPENSES: ExpenseRecord[] = [
  {
    id: "e1",
    category: "食費",
    amount: 3200,
    memberId: "u1",
    memberName: "田中",
    memo: "スーパーで買い物",
    date: "2026-01-31T18:30:00",
  },
  {
    id: "e2",
    category: "住居",
    amount: 12000,
    memberId: "u2",
    memberName: "鈴木",
    memo: "電気代 1月分",
    date: "2026-01-30T10:00:00",
  },
  {
    id: "e3",
    category: "交通",
    amount: 1580,
    memberId: "u3",
    memberName: "佐藤",
    memo: "タクシー代",
    date: "2026-01-29T22:15:00",
  },
  {
    id: "e4",
    category: "娯楽",
    amount: 4500,
    memberId: "u4",
    memberName: "高橋",
    memo: "映画＋ポップコーン",
    date: "2026-01-28T14:00:00",
  },
  {
    id: "e5",
    category: "食費",
    amount: 8900,
    memberId: "u1",
    memberName: "田中",
    memo: "みんなで外食",
    date: "2026-01-27T19:30:00",
  },
  {
    id: "e6",
    category: "貯金",
    amount: 30000,
    memberId: "u2",
    memberName: "鈴木",
    memo: "共有貯金",
    date: "2026-01-25T09:00:00",
  },
  {
    id: "e7",
    category: "住居",
    amount: 5400,
    memberId: "u3",
    memberName: "佐藤",
    memo: "水道代 1月分",
    date: "2026-01-24T11:00:00",
  },
  {
    id: "e8",
    category: "その他",
    amount: 2100,
    memberId: "u4",
    memberName: "高橋",
    memo: "日用品",
    date: "2026-01-23T16:45:00",
  },
  {
    id: "e9",
    category: "交通",
    amount: 520,
    memberId: "u1",
    memberName: "田中",
    memo: "バス代",
    date: "2026-01-22T08:20:00",
  },
  {
    id: "e10",
    category: "食費",
    amount: 1800,
    memberId: "u3",
    memberName: "佐藤",
    memo: "コンビニ",
    date: "2026-01-21T12:30:00",
  },
];

/** カテゴリの色マップ */
export const CATEGORY_COLORS: Record<CategoryName, string> = {
  貯金: "#22c55e",
  住居: "#f97316",
  交通: "#38bdf8",
  食費: "#ef4444",
  娯楽: "#8b5cf6",
  その他: "#94a3b8",
};

/** メンバー色マップ */
export const MEMBER_COLORS: Record<string, string> = {
  u1: "#F59E0B",
  u2: "#3B82F6",
  u3: "#EC4899",
  u4: "#10B981",
};
