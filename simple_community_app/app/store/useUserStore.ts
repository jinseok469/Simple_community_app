// app/store/useUserStore.ts
import { create } from 'zustand';

type User = {
  uid: string;
  email: string;
  nickname: string;
};

type UserStore = {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: {
    uid: '',
    email: '',
    nickname: '',
  },
  setUser: (user) => set({ user }),
  clearUser: () =>
    set({
      user: {
        uid: '',
        email: '',
        nickname: '',
      },
    }),
}));
