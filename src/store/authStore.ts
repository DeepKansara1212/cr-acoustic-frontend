import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

type StoredUser = User & { password: string };

type AuthResult = { success: true } | { success: false; error: string };

type AuthStore = {
  users: StoredUser[];
  user: User | null;
  signup: (data: { firstName: string; lastName: string; email: string; password: string }) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "firstName" | "lastName" | "phone">>) => void;
};

const DEMO_USER: StoredUser = {
  id: "demo-user",
  firstName: "Demo",
  lastName: "Customer",
  email: "demo@cracoustic.com",
  password: "password123",
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      users: [DEMO_USER],
      user: null,
      signup: ({ firstName, lastName, email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (get().users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
          return { success: false, error: "An account with this email already exists." };
        }
        const newUser: StoredUser = {
          id: crypto.randomUUID(),
          firstName,
          lastName,
          email: normalizedEmail,
          password,
        };
        set((s) => ({ users: [...s.users, newUser], user: toPublicUser(newUser) }));
        return { success: true };
      },
      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const found = get().users.find((u) => u.email.toLowerCase() === normalizedEmail);
        if (!found || found.password !== password) {
          return { success: false, error: "Invalid email or password." };
        }
        set({ user: toPublicUser(found) });
        return { success: true };
      },
      logout: () => set({ user: null }),
      updateProfile: (data) =>
        set((s) => {
          if (!s.user) return s;
          const updatedUser = { ...s.user, ...data };
          return {
            user: updatedUser,
            users: s.users.map((u) => (u.id === updatedUser.id ? { ...u, ...data } : u)),
          };
        }),
    }),
    { name: "cr-auth" }
  )
);

function toPublicUser(u: StoredUser): User {
  return { id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone };
}
