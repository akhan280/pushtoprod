
"use client"

import { toast } from "../../../../../../../components/ui/use-toast";
import { getSingularProject } from "../../../../../../../lib/actions";
import useMainStore from "../../../../../../../lib/hooks/use-main-store";
import Header from "@/components/projects/header";

export default function IdeasRenderer({ params }: { params: {id: string} }) {

    const {selectedProject, setSelectedProject} = useMainStore();

    console.log('[Path rendering]', params)

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
        setSelectedProject({...data.project!, previous: "ideas", next: "ideas"});
    }

    if (!selectedProject || !selectedProject.id) {
        projectHandler();
    }
  
    return (
        <div className="flex flex-col justify-center items-center place-items-center">
            <Header partial={false}></Header>
      </div>
    );
}
