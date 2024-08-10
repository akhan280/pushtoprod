import { StateCreator } from 'zustand';

type KeyState = {
  publicKey: string;
  privateKey: string;
};

type KeyActions = {
  setPublic: (publicKey: string) => void;
  setPrivate: (privateKey: string) => void;
};

export type KeySlice = KeyState & KeyActions;

export const createKeySlice: StateCreator<KeySlice> = (set) => ({
  publicKey: typeof window !== 'undefined' ? localStorage.getItem('publicKey') || '' : '',
  privateKey: typeof window !== 'undefined' ? localStorage.getItem('privateKey') || '' : '',

  setPublic: (publicKey: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('publicKey', publicKey);
    }
    set({ publicKey });
  },

  setPrivate: (privateKey: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('privateKey', privateKey);
    }
    set({ privateKey });
  },
});
