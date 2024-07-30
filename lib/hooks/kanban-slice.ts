import { StateCreator } from 'zustand';
import { Project } from '../types';

type KanbanStore = {
  projects: Project[];
};

type KanbanActions = {
  addProject: (project: Project) => void;
  setProjects: (projects: Project[]) => any;
};

export type KanbanSlice = KanbanStore & KanbanActions;

export const createKanbanSlice: StateCreator<KanbanSlice> = (set, get) => ({
  projects: [],
  addProject: (project: Project) => set((state) => ({
    projects: [...state.projects, project]
  })),
  // setProjects: (projects: Project[]) => {
  //   set(() => ({
  //     projects: projects
  //   }));
  //   return projects;
  // }
  setProjects: (projects: Project[]) => {
    set({ projects });
  },
});
