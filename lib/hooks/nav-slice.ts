import { StateCreator } from 'zustand';

type NavStore = {
  previousUrl: string;
};

type NavActions = {
  setPreviousUrl: (url: string) => void;
  
};

export type NavSlice = NavStore & NavActions;

export const createNavSlice: StateCreator<NavSlice> = (set, get) => ({
  previousUrl: "",

  setPreviousUrl: (previousUrl: string) => {
    set({previousUrl})
  },

  
});
