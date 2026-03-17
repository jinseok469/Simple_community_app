// store/usePostStore.ts
import { create } from 'zustand';

type PostStore = {
  selectedPostId: string | "";
  setSelectedPostId: (id: string) => void;
  clearSelectedPostId: () => void;
};

export const usePostStore = create<PostStore>((set) => ({
  selectedPostId: "",
  setSelectedPostId: (id) => set({ selectedPostId: id }),
  clearSelectedPostId: () => set({ selectedPostId: "" }),
}));
