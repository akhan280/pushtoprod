import { StateCreator } from 'zustand';
import { Project } from '../types';
import { ColumnId } from '@/components/kanban/kanban';

export type ProjectMovement = Project & {
  previous: string;
  next: string;
};

type KanbanStore = {
  dialog: boolean;
  dragged: boolean;
  loading: boolean;
  requestedAdd: string | null;
  projects: Project[];
  selectedProject: ProjectMovement;
};

type KanbanActions = {
  showDialog: (dialog: boolean) => void;
  showDraggedDialog: (dragged: boolean) => void;
  addProject: (project: Project) => void;
  setProjects: (projects: Project[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedProject: (project: ProjectMovement) => void;
  setRequestAdd: (requestedAdd: string) => void;
};

export type KanbanSlice = KanbanStore & KanbanActions;

export const createKanbanSlice: StateCreator<KanbanSlice> = (set, get) => ({
  projects: [],
  dialog: false,
  dragged: false,
  requestedAdd: '',
  loading: false,
  
  setLoading: (loading: boolean) => {
    set({loading: loading});
  },

  selectedProject: {
    id: '',
    title: '',
    description: '',
    tags: [],
    collaborators: [],
    technologies: [],
    githuburl: '',
    websiteurl: '',
    columnId: '',
    previous: '',
    next: ''
  },

  addProject: (project: Project) => {
    set({requestedAdd: null})
    set((state) => ({
    projects: [...state.projects, project]
  }))},

  setProjects: (projects: Project[]) => {
    set({requestedAdd: null})
    set({ projects });
  },

  showDialog: (dialog: boolean) => {
    set({requestedAdd: null})
    set({ dialog });
  },

  showDraggedDialog: (dragged: boolean) => {
    set({requestedAdd: null})
    set({dragged});
  },

  setRequestAdd: (requestedAdd: string) => {
    console.log('[Kanban Slice] Setting requested add',requestedAdd);
    set({requestedAdd})
  },

  setSelectedProject: (project: ProjectMovement) => {
    console.log('[Kanban Slice] Selected Project', project)

    if (project?.previous === project?.next) {
      set({dragged: false})
    } else {
      set({dragged: true})
    }

    set({ selectedProject: project });
  },
});
