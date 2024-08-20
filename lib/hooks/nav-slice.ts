import { StateCreator } from 'zustand';

type NavStore = {
  previousUrls: string[]; 
};

type NavActions = {
  pushUrl: (url: string) => void;
  popUrl: () => string | undefined;
};

export type NavSlice = NavStore & NavActions;

export const createNavSlice: StateCreator<NavSlice> = (set, get) => ({
  previousUrls: [],

  pushUrl: (url: string) => {
    set((state) => ({
      previousUrls: [...state.previousUrls, url],
    }));
  },

  popUrl: () => {
    const state = get();
    const previousUrls = [...state.previousUrls];
    const lastUrl = previousUrls.pop(); 

    set({ previousUrls });
    return lastUrl;
  },
});