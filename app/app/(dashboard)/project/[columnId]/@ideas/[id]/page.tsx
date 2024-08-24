
"use client"

import { toast } from "../../../../../../../components/ui/use-toast";
import { getSingularProject } from "../../../../../../../lib/actions";
import useMainStore from "../../../../../../../lib/hooks/use-main-store";
import Header from "@/components/projects/header";
import Image from "next/image"

export default function IdeasRenderer({ params }: { params: { id: string } }) {

    const { selectedProject, setSelectedProject } = useMainStore();

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
        setSelectedProject({ ...data.project!, previous: "ideas", next: "ideas" });
    }

    if (!selectedProject || !selectedProject.id) {
        projectHandler();
    }

    return (
        <div>
            <div className="flex flex-col justify-center items-center place-items-center">
                <div className="absolute top-0 left-0 p-4 z-0">
                    <Image
                        src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/orange-corner-gradient.png?t=2024-08-24T00%3A57%3A40.663Z" // Replace with the correct path to your image
                        alt="Top Left Image"
                        width={250} // Adjust width and height as needed
                        height={350}
                    />
                </div>

            </div>
            <div className="relative ml-20 mt-10 z-10" >
            <Header partial={false}></Header>
            </div>
        </div>


    );
}
