import type { User, UserRole, UserStatus } from "@/types";

const FIRST_NAMES = [
  "Alice", "Bob", "Carol", "David", "Eva", "Frank", "Grace", "Henry",
  "Iris", "James", "Karen", "Leo", "Mia", "Noah", "Olivia", "Paul",
  "Quinn", "Rachel", "Sam", "Tara", "Uma", "Victor", "Wendy", "Xander",
  "Yara", "Zane",
];

const LAST_NAMES = [
  "Anderson", "Brown", "Chen", "Davis", "Evans", "Foster", "Garcia",
  "Harris", "Iyer", "Jones", "Kumar", "Lee", "Martin", "Nguyen",
  "O'Brien", "Patel", "Quinn", "Roberts", "Smith", "Taylor",
];

const DEPARTMENTS = [
  "Engineering", "Product", "Design", "Marketing",
  "Sales", "Finance", "HR", "Operations",
];

const ROLES: UserRole[] = ["admin", "editor"];
const STATUSES: UserStatus[] = ["active", "inactive", "pending"];

function seededPick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function seededDate(seed: number): string {
  const start = new Date("2022-01-01").getTime();
  const range = new Date("2024-12-31").getTime() - start;
  const ms = start + (seed * 7_919) % range;
  return new Date(ms).toISOString();
}

export const MOCK_USERS: User[] = Array.from({ length: 50 }, (_, i) => {
  const seed = i + 1;
  const firstName = seededPick(FIRST_NAMES, seed * 3);
  const lastName = seededPick(LAST_NAMES, seed * 7);
  return {
    id: `usr_${String(seed).padStart(3, "0")}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    role: seededPick(ROLES, seed * 2),
    status: seededPick(STATUSES, seed * 5),
    department: seededPick(DEPARTMENTS, seed * 4),
    createdAt: seededDate(seed),
  };
});
