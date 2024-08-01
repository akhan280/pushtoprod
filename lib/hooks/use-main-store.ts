import { create } from 'zustand'
import { AuthSlice, createAuthSlice } from './auth-slice';
import { KanbanSlice, createKanbanSlice } from './kanban-slice';
import { NavSlice, createNavSlice } from './nav-slice';

export type MainStoreType = AuthSlice & KanbanSlice & NavSlice;

const useMainStore = create<MainStoreType>((...a) => ({
  ...createKanbanSlice(...a),
  ...createNavSlice(...a),
  ...createAuthSlice(...a),
}));

export default useMainStore;
