import { create } from 'zustand'
import { AuthSlice, createAuthSlice } from './auth-slice';
import { KanbanSlice, createKanbanSlice } from './kanban-slice';
import { NavSlice, createNavSlice } from './nav-slice';
import { FormSlice, createFormSlice } from './form-slice';
import { SiteSlice, createSiteSlice } from './site-slice';
import { KeySlice, createKeySlice } from './key-slice';

export type MainStoreType = AuthSlice & KanbanSlice & NavSlice & FormSlice & SiteSlice & KeySlice;

const useMainStore = create<MainStoreType>((...a) => ({
  ...createKanbanSlice(...a),
  ...createNavSlice(...a),
  ...createAuthSlice(...a),
  ...createFormSlice(...a),
  ...createSiteSlice(...a),
  ...createKeySlice(...a),
}));

export default useMainStore;
