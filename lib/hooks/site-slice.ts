import { StateCreator } from 'zustand';
import { Site } from '@prisma/client';
import { getAllColumnProjects, getMultipleProjects, updateSite, updateSiteJSON } from '../site-actions';
import { LocalSiteData, Section } from '../../app/app/(dashboard)/site/types';

export interface SiteProject {
  id: string;
  title: string;
  description: string;
  columnId: string;
  display: boolean;
}

type SiteStore = {
    site: Site | null,
    localSite: LocalSiteData | null
    displayedProjects: SiteProject[] | null
    hiddenProjectCount: {[key: string]: number} | null


    columnProjects: {columnId: string, projects: SiteProject[]}[] | null
    selectedColumns: {columnId: string; projectIds: SiteProject[]}[] | null
};

type GetAllColumnProjectsProp = {
  columnToProject: {
    columnId: string;
    projects: SiteProject[];
  }[];
  selectedProjects: SiteProject[]
};

type SiteActions = {
    setSite: (site: Site) => void;
    setLocalSiteData: (data: LocalSiteData) => void;
    updateSection: (sectionId: number, updates: Partial<Section>) => Promise<any>;
    updateProjectDisplay: (projectId: string, columnId: string, display: boolean) => void;
    moveSection: (oldIndex: number, newIndex: number) => void;
    addSection: (newSection: Section) => void;
    removeSection: (sectionId: number) => void;
    fetchColumnProjects: () => Promise<GetAllColumnProjectsProp>;
    setSelectedColumns: (selectedColumns: {columnId: string; projectIds: SiteProject[]}[]) => void;
};



export type SiteSlice = SiteStore & SiteActions;

export const createSiteSlice: StateCreator<SiteSlice> = (set, get) => ({
    site: null,
    localSite: null,
    displayedProjects: null,
    hiddenProjectCount: null,
    columnProjects: [],
    selectedColumns: null,
    
    fetchColumnProjects: async () => {
      const data = await getAllColumnProjects();
      const projects = data.columnToProject;
      const selectedProjects = data.selectedProjects;
      console.log('[ZUSTAND] Projects', projects)
      console.log('[ZUSTAND] SelectedProjects', selectedProjects)

      set({columnProjects: projects})
      return {
        columnToProject: projects,
        selectedProjects: selectedProjects
      }
    },

    updateProjectDisplay: (projectId: string, columnId: string, display: boolean) => {
      set((state) => {
        const columnProjects = state.columnProjects?.map((column) => {
          if (column.columnId === columnId) {
            const updatedProjects = column.projects.map((project) =>
              project.id === projectId ? { ...project, display } : project
            );
            return { ...column, projects: updatedProjects };
          }
          return column;
        });
        return { ...state, columnProjects };
      });
    },

    setSite: (site: Site) => {
        console.log('[Site Store] Setting', site)
        set({site: site})
    },
    
    setSelectedColumns: (selectedColumns: {columnId: string; projectIds: SiteProject[]}[]) => {
        set({selectedColumns})
    },

    setLocalSiteData: (data: LocalSiteData) => set({ localSite: data }),

  
    updateSection: async (sectionId, updates) => {
      const state = get();
      if (!state.localSite) {
          throw new Error('No local site data');
      }

      const updatedSections = state.localSite.parsedSections.map(section =>
          section.id === sectionId ? { ...section, ...updates } : section
      );

      console.log('[SITE SLICE] Updating Section', updates)
      const updatedLocalSite = {
          ...state.localSite,
          parsedSections: updatedSections
      };

      set({ localSite: updatedLocalSite });

      try {
        console.log('entering')
          const site = await updateSiteJSON({
              ...updatedLocalSite,
              sections: JSON.stringify(updatedSections)
          });
         
          return {
            ...state,
            localSite: {
              ...state.localSite,
              parsedSections: updatedSections
            }
          };
          
      } catch (error) {
          console.error('Failed to update site:', error);
          throw error;
      }
  },

  
  
  moveSection: (oldIndex, newIndex) => set((state) => {
      if (!state.localSite) return state;
  
      const sections = [...state.localSite.parsedSections];
      const [movedSection] = sections.splice(oldIndex, 1);
      sections.splice(newIndex, 0, movedSection);
  
      return {
        ...state,
        localSite: {
          ...state.localSite,
          parsedSections: sections
        }
      };
    }),
  
    addSection: (newSection) => set((state) => {
      if (!state.localSite) return state;
  
      return {
        ...state,
        localSite: {
          ...state.localSite,
          parsedSections: [...state.localSite.parsedSections, newSection]
        }
      };
    }),
  
    removeSection: (sectionId) => set((state) => {
      if (!state.localSite) return state;
  
      return {
        ...state,
        localSite: {
          ...state.localSite,
          parsedSections: state.localSite.parsedSections.filter(section => section.id !== sectionId)
        }
      };
    }),
});