
import { StateCreator } from 'zustand';
import { KanbanSlice, ProjectMovement } from './kanban-slice';
import { updateEditor, updateProjectField } from '../actions';
import { toast } from '../../components/ui/use-toast';

type FormStore = {};

type FormActions = {
  setProjectProperty: <K extends keyof ProjectMovement>(key: K, value: ProjectMovement[K]) => Promise<any>;
  setEditorProperty: (editor: any) => void;
};

export type FormSlice = FormStore & FormActions & Partial<KanbanSlice>;

export const createFormSlice: StateCreator<FormSlice> =  (set, get)  => ({

  setEditorProperty: async (editor: any) => {
    console.log('[FORM SLICE] Updating Editor', editor)
    await updateEditor(editor, get().selectedProject?.id!)
    console.log('hi')

    if (!updateEditor) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  },

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
