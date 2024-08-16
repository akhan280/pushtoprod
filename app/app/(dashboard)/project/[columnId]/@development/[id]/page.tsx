
"use client"

import { useEffect, useState } from "react";
import Header from "../../../../../../../components/projects/header";
import { toast } from "../../../../../../../components/ui/use-toast";
import { getSingularProject } from "../../../../../../../lib/actions";
import useMainStore from "../../../../../../../lib/hooks/use-main-store"
import DevelopmentRender from "./renderer"
import { ButtonLoading } from "../../../../../../../components/ui/loading-ui/button-loading";
export default function Development({ params }: { params: {id: string} }) {

    const {selectedProject, setSelectedProject} = useMainStore();
    const [loading, setLoading] = useState(false);

    console.log('[Path rendering]', params)

    if (params.id === "new") {
        return (
        <>
        hi
        </>
        )
    }
    
    useEffect(() => {
        setLoading(true)
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
        setLoading(false)
    }, [])

    
    return (
        <>
        {loading ? <div><ButtonLoading></ButtonLoading></div> :
          <DevelopmentRender></DevelopmentRender>}
        </>
    )
}