import { StateCreator } from 'zustand';
import { Project } from '../types';

type ProjectMovement = Project & {
  previous: string;
  next: string;
};

type KanbanStore = {
  dialog: boolean;
  projects: Project[];
  selectedProject: ProjectMovement | null;
};

type KanbanActions = {
  showDialog: (dialog: boolean) => void;
  addProject: (project: Project) => void;
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: ProjectMovement | null) => void;
};

export type KanbanSlice = KanbanStore & KanbanActions;

export const createKanbanSlice: StateCreator<KanbanSlice> = (set, get) => ({
  projects: [],
  dialog: false,
  selectedProject: null,
  addProject: (project: Project) => set((state) => ({
    projects: [...state.projects, project]
  })),
  setProjects: (projects: Project[]) => {
    set({ projects });
  },
  showDialog: (dialog: boolean) => {
    set({ dialog });
  },
  setSelectedProject: (project: ProjectMovement | null) => {
    console.log('[Kanban Slice] Selected Project', project)
    set({ selectedProject: project });
  },
});
