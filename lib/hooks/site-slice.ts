import { StateCreator } from 'zustand';
import { Site } from '@prisma/client';
import { updateSite, updateSiteJSON } from '../site-actions';
import { LocalSiteData, Section } from '../../app/app/(dashboard)/site/types';

type SiteStore = {
    site: Site | null,
    localSite: LocalSiteData | null
};

type SiteActions = {
    setSite: (site: Site) => void;
    setLocalSiteData: (data: LocalSiteData) => void;
    updateSection: (sectionId: number, updates: Partial<Section>) => Promise<any>;
    moveSection: (oldIndex: number, newIndex: number) => void;
    addSection: (newSection: Section) => void;
    removeSection: (sectionId: number) => void;
};

export type SiteSlice = SiteStore & SiteActions;

export const createSiteSlice: StateCreator<SiteSlice> = (set, get) => ({
    site: null,
    localSite: null,

    setSite: (site: Site) => {
        console.log('[Site Store] Setting', site)
        set({site: site})
    },

    setLocalSiteData: (data) => set({ localSite: data }),
  
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
      // console.log('[SITE SLICE] Updated Section', get().localSite)


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