import { create } from 'zustand'
import { AuthSlice, createAuthSlice } from './auth-slice';
import { KanbanSlice, createKanbanSlice } from './kanban-slice';

export type MainStoreType = AuthSlice & KanbanSlice;

const useMainStore = create<MainStoreType>((...a) => ({
  ...createAuthSlice(...a),
  ...createKanbanSlice(...a),
}));

export default useMainStore;
