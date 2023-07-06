import { User } from "@wasp/entities";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserIdsState {
  users: Pick<User, "id" | "username">[];
}

export const useUserIdStore = create<UserIdsState>()((set) => ({
  users: [],
  updateUsers: (users: Pick<User, "id" | "username">[]) =>
    set(() => ({ users: users })),
}));
