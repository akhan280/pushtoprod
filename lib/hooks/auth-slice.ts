import { StateCreator } from 'zustand';

type AuthStore = {
  phone: string;
  code: string;
};

type AuthActions = {
  setPhone: (phone: string) => void;
  setCode: (code: string) => void;
};

export type AuthSlice = AuthStore & AuthActions;

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  phone: '',
  code: '',
  setPhone: (phone: string) => set(() => ({ phone })),
  setCode: (code: string) => set(() => ({ code })),
});
