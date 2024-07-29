import { create } from 'zustand'
import { AuthSlice, createAuthSlice } from './auth-slice';

export type MainStoreType = AuthSlice;

const useMainStore = create<MainStoreType>((...a) => ({
  ...createAuthSlice(...a),
}));

export default useMainStore;
