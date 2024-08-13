// import { StateCreator } from 'zustand';
// import { getMultipleProjects } from '../site-actions';

// interface SiteProject {
//     id: string;
//     title: string;
//     description: string;
//     columnId: string;
//   }
  

//   interface SiteProjectStore {
//     projects: SiteProject[];
//     hiddenProjectsCount: { [key: string]: number };
//     error: string | null;
//     fetchProjects: (allIds: string[]) => Promise<void>;
//   }
  

// export const createSiteProjectSlice: StateCreator<SiteProjectStore> = (set) => ({
//     projects: [],  // This will be an empty array initially
//     hiddenProjectsCount: {},  // This will be an empty object initially
//     error: null,  // This will be null initially
  
//     fetchProjects: async (allIds: string[]) => {
//       try {
//         const { projects, hiddenProjectsCount, error } = await getMultipleProjects(allIds);
//         if (error) {
//           set({ error });
//         } else {
//           set({ projects, hiddenProjectsCount, error: null });
//         }
//       } catch (err) {
//         set({ error: 'Failed to fetch projects' });
//       }
//     },
//   });

import { StateCreator } from 'zustand';
import { getMultipleProjects } from '../site-actions';

interface SiteProject {
  id: string;
  title: string;
  description: string;
  columnId: string;
}

interface SiteProjectStore {
  projects: SiteProject[];
  hiddenProjectsCount: { [key: string]: number };
  error: string | null;
  fetchProjects: (allIds: string[]) => Promise<void>;
}

export type SiteProjectSlice = SiteProject & SiteProjectStore;

export const createSiteProjectSlice: StateCreator<SiteProjectSlice> = (set) => ({
  
  id: '', 
  title: '',
  description: '',  
  columnId: '',  


  projects: [],  
  hiddenProjectsCount: {},  
  error: null, 

  // SiteProjectStore actions
  fetchProjects: async (allIds: string[]) => {
    try {
      const { projects, hiddenProjectsCount, error } = await getMultipleProjects(allIds);
      if (error) {
        set({ error });
      } else {
        set({ projects, hiddenProjectsCount, error: null });
      }
    } catch (err) {
      set({ error: 'Failed to fetch projects' });
    }
  },
});