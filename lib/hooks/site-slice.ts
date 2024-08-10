import { StateCreator } from 'zustand';
import { Site } from '@prisma/client';
import { updateSite } from '../site-actions';

type SiteStore = {
    site: Site
};

type SiteActions = {
    setSite: (site: Site) => void;
  setSiteProperty: <K extends keyof Site>(key: K, value: Site[K], siteId: string) => Promise<string>;
};

export type SiteSlice = SiteStore & SiteActions;

export const createSiteSlice: StateCreator<SiteSlice> = (set, get) => ({
    site: {
        id: '',
        name: null,
        description: null,
        logo: null,
        font: '',
        image: null,
        imageBlurhash: null,
        subdomain: null,
        customDomain: null,
        message404: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: null,
    },

    setSite: (site: Site) => {
        console.log('[Site Store] Setting', site)
        set({site: site})
    },

  setSiteProperty: async <K extends keyof Site>(key: K, value: Site[K]) => {
    console.log(`Changing ${key} to ${value} for site ${get().site.id}`);

    const formData = new FormData();
    formData.append(key, value as string); // Assuming `value` is a string, adjust if necessary
    
    try {
      const data = await updateSite(formData, get().site, key);

      set((state) => ({
        ...state,
        [key]: value,
      }));

      return "success";
    } catch (error) {
      console.error(`Error updating site property ${key}:`, error);
      throw error;
    }
  },
});
