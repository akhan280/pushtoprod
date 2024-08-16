import { StateCreator } from 'zustand';
import { Site } from '@prisma/client';
import { getAllColumnProjects, getMultipleProjects, updateSite, updateSiteJSON } from '../site-actions';
import { LocalSiteData, Section, SiteProjects } from '../../components/site/site-interfaces';

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
        const updatedColumnProjects = state.columnProjects?.map((column) => {
          if (column.columnId === columnId) {
            const updatedProjects = column.projects.map((project) =>
              project.id === projectId ? { ...project, display } : project
            );
            console.log(`[(1) Updated Projects in ${columnId}]`, updatedProjects);
            return { ...column, projects: updatedProjects };
          }
          return column;
        });
        console.log('[(2) Updated Column Projects]', updatedColumnProjects);
        return { ...state, updatedColumnProjects };
      });

      console.log('[All projects]', get().columnProjects)

      const allProjects = get().columnProjects;

      const tempProject: SiteProjects = { 
        development: [],
        launches: [],
        writing: [],
        ideas: [],
      };
      
      allProjects?.forEach((project) => {
        if (project.columnId === "development") {
          // Filter projects where display is true, then map their ids
          const displayedProjects = project.projects
            .filter(p => p.display === true)
            .map(p => p.id);
          tempProject.development.push(...displayedProjects);
        } else if (project.columnId === "launches") {
          const displayedProjects = project.projects
            .filter(p => p.display === true)
            .map(p => p.id);
          tempProject.launches.push(...displayedProjects);
        } else if (project.columnId === "writing") {
          const displayedProjects = project.projects
            .filter(p => p.display === true)
            .map(p => p.id);
          tempProject.writing.push(...displayedProjects);
        } else if (project.columnId === "ideas") {
          const displayedProjects = project.projects
            .filter(p => p.display === true)
            .map(p => p.id);
          tempProject.ideas.push(...displayedProjects);
        }
      });
      
      console.log('this is temp', tempProject);

      get().updateSection(4, { content: tempProject });
    
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

  moveSection: (oldIndex, newIndex) => {
    console.log('Moving the section')

    const state = get();
    if (!state.localSite) return state;

    console.log('Moving section')
  
    const sections = [...state.localSite.parsedSections];
    const [movedSection] = sections.splice(oldIndex, 1);
    sections.splice(newIndex, 0, movedSection); 
  
    const updatedLocalSite = {
      ...state.localSite,
      parsedSections: sections,
    };
  
    set({ localSite: updatedLocalSite });
  
    try {
      console.log("Saving new section order to backend...");
      updateSiteJSON({
        ...updatedLocalSite,
        sections: JSON.stringify(sections),
      });
    } catch (error) {
      console.error("Failed to save new section order:", error);
    }
  
    return updatedLocalSite;
  },
  
    addSection: (newSection) => {
      const state = get();
      if (!state.localSite) return state;
  
      const updatedSections = [...state.localSite.parsedSections, newSection];
      console.log('[SITE SLICE] Updating Sections:', updatedSections);
  
      const updatedLocalSite = {
          ...state.localSite,
          parsedSections: updatedSections,
      };
  
      set({ localSite: updatedLocalSite });
  
      try {
          console.log('Entering updateSiteJSON...');
          // Call the async function to update the site JSON
          const site = updateSiteJSON({
              ...updatedLocalSite,
              sections: JSON.stringify(updatedSections),
          });
  
          console.log('Site updated successfully', site);
  
          // Return the new state after successful async operation
          return {
              ...state,
              localSite: {
                  ...state.localSite,
                  parsedSections: updatedSections,
              },
          };
      } catch (error) {
          console.error('Failed to update site:', error);
          throw error;
      }
    },

    removeSection: async (sectionId) => {
      console.log('removing')
      const state = get();
      if (!state.localSite) return state;
    
      // Filter out the section with the given sectionId
      const updatedSections = state.localSite.parsedSections.filter(section => section.id !== sectionId);
      
      console.log('[SITE SLICE] Removing Section ID:', sectionId);
      console.log('[SITE SLICE] Updated Sections:', updatedSections);
    
      const updatedLocalSite = {
        ...state.localSite,
        parsedSections: updatedSections,
      };
    
      // Immediately update the local state with the new sections
      set({ localSite: updatedLocalSite });
    
      try {
        console.log('Entering updateSiteJSON...');
        // Call the async function to update the site JSON
        const site = await updateSiteJSON({
          ...updatedLocalSite,
          sections: JSON.stringify(updatedSections),
        });
    
        console.log('Site updated successfully', site);
    
        // Return the new state after successful async operation
        return {
          ...state,
          localSite: {
            ...state.localSite,
            parsedSections: updatedSections,
          },
        };
      } catch (error) {
        console.error('Failed to update site:', error);
        throw error;
      }
    },
});