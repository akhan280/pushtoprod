import { create } from 'zustand'
import { AuthSlice, createAuthSlice } from './auth-slice';
import { KanbanSlice, createKanbanSlice } from './kanban-slice';
import { NavSlice, createNavSlice } from './nav-slice';
import { FormSlice, createFormSlice } from './form-slice';

export type MainStoreType = AuthSlice & KanbanSlice & NavSlice & FormSlice; 

const useMainStore = create<MainStoreType>((...a) => ({
  ...createKanbanSlice(...a),
  ...createNavSlice(...a),
  ...createAuthSlice(...a),
  ...createFormSlice(...a),
}));

export default useMainStore;
