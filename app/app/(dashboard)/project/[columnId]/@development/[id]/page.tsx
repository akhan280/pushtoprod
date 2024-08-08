
"use client"

import { toast } from "../../../../../../../components/ui/use-toast";
import { getSingularProject } from "../../../../../../../lib/actions";
import useMainStore from "../../../../../../../lib/hooks/use-main-store"
import DevelopmentRender from "./renderer"
export default function Development({ params }: { params: {id: string} }) {

    const {selectedProject, setSelectedProject} = useMainStore();

    console.log('[Path rending]', params)

    if (params.id === "new") {
        return (
        <>
        hi
        </>
        )
    }
    
    async function projectHandler() {
        const data = await getSingularProject(params.id);
        if (data.error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            });
            return
        }
        setSelectedProject({...data.project!, previous: "development", next: "development"});
    }

    if (!selectedProject || !selectedProject.id) {
        projectHandler();
    }
    
    return (
        <>
          <DevelopmentRender></DevelopmentRender>
        </>
    )
}