/**
 * モックデータ（API レスポンス用）
 *
 * このファイルは API ルートから参照されます。
 * フロントエンド（クライアントコンポーネント）からは直接インポートせず、
 * API 経由で取得してください。
 */

import type {
  Group,
  UserProfile,
  ExpenseRecord,
  CategoryName,
} from "@/types";

/* ========== ユーザー ========== */

export const MOCK_USER: UserProfile = {
  id: "u1",
  name: "田中 太郎",
  email: "tanaka@example.com",
  color: "#F59E0B",
};

/* ========== グループ ========== */

export const MOCK_GROUP: Group = {
  id: "grp-001",
  name: "東京シェアハウス",
  color: "#c9a227",
  members: [
    { id: "u1", name: "田中", color: "#F59E0B" },
    { id: "u2", name: "鈴木", color: "#3B82F6" },
    { id: "u3", name: "佐藤", color: "#EC4899" },
    { id: "u4", name: "高橋", color: "#10B981" },
  ],
};

export const MOCK_GROUPS: Group[] = [
  MOCK_GROUP,
  {
    id: "grp-002",
    name: "大学サークル会計",
    color: "#3B82F6",
    members: [
      { id: "u1", name: "田中", color: "#F59E0B" },
      { id: "u5", name: "山田", color: "#6366F1" },
      { id: "u6", name: "伊藤", color: "#F43F5E" },
    ],
  },
  {
    id: "grp-003",
    name: "旅行（沖縄）",
    color: "#10B981",
    members: [
      { id: "u2", name: "鈴木", color: "#3B82F6" },
      { id: "u3", name: "佐藤", color: "#EC4899" },
    ],
  },
];

/* ========== 支出 ========== */

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

/* ========== 色マップ（表示用定数） ========== */

export const CATEGORY_COLORS: Record<CategoryName, string> = {
  貯金: "#22c55e",
  住居: "#f97316",
  交通: "#38bdf8",
  食費: "#ef4444",
  娯楽: "#8b5cf6",
  その他: "#94a3b8",
};

export const MEMBER_COLORS: Record<string, string> = {
  u1: "#F59E0B",
  u2: "#3B82F6",
  u3: "#EC4899",
  u4: "#10B981",
};
