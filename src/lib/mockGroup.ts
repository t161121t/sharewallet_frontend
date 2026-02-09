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

/** モックグループデータ */
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

/** グループ一覧（モック） */
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

const STORAGE_KEY = "sharewallet_group";

/** グループ情報を localStorage に保存 */
export function saveGroup(group: Group) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(group));
}

/** グループ情報を localStorage から取得 */
export function loadGroup(): Group | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Group;
  } catch {
    return null;
  }
}
