
import { StateCreator } from 'zustand';
import { KanbanSlice, ProjectMovement } from './kanban-slice';
import { updateProjectField } from '../actions';

type FormStore = {};

type FormActions = {
  setProjectProperty: <K extends keyof ProjectMovement>(key: K, value: ProjectMovement[K]) => Promise<any>;
};

export type FormSlice = FormStore & FormActions & Partial<KanbanSlice>;

export const createFormSlice: StateCreator<FormSlice> =  (set, get)  => ({
  
    setProjectProperty: async (key, value)  => {
    console.log(`Changing ${key} to ${value}`)
    const modifiedProject = get().selectedProject;
    if (!modifiedProject) {
      throw new Error('No project selected');
    }
    if (!(key in modifiedProject)) {
      throw new Error(`Invalid key: ${key}`);
    }
    // call server action

    
    (modifiedProject as ProjectMovement)[key] = value;
    set({ selectedProject: modifiedProject });
    updateProjectField(modifiedProject.id, key, value as string)
    
    return "success"
  },
});
