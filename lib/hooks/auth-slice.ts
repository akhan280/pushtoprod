import { StateCreator } from 'zustand';
import { User } from '../types';
import { updateUserField } from '../actions';

type AuthStore = {
  phone: string;
  code: string;
  email: string;
};

type AuthActions = {
  setPhone: (phone: string) => void;
  setCode: (code: string) => void;
  setUserProperty: <K extends keyof User>(key: K, value: User[K], userId: string) => Promise<string>;
};

export type AuthSlice = AuthStore & AuthActions;

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  phone: '',
  code: '',
  email: '',
  setPhone: (phone: string) => set(() => ({ phone })),
  setCode: (code: string) => set(() => ({ code })),

  setUserProperty: async (key, value, userId) => {
      console.log(`Changing ${key} to ${value} for user ${userId}`);
      const data = await updateUserField(userId, key, value);
      if (data.error) {
        console.error(`Failed to update ${key} for user ${userId}:`);
        throw (`Failed to update ${key} for user ${userId}:`);
      }
      set((state) => ({
        ...state,
        [key]: value,
      }));
      return "success";
  },
});
