
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useMainStore from "@/lib/hooks/use-main-store";
import Image from "next/image";
import { Technology } from "../../lib/types";
import { Card } from "../ui/card";
import { useState, useEffect } from "react";
import { getAllTechnologies, updateProjectField, updateProjectTechnologies, removeTechnology} from "../../lib/actions";
import { Input } from "../ui/input";
import { ButtonLoading } from "../ui/loading-ui/button-loading";
import { toast } from "../ui/use-toast";



const technologyCardVariants = cva(
  "flex flex-col items-center p-2 rounded-md transition-all",
  {
    variants: {
      variant: {
        icon: "space-x-2",
        iconWithText: "space-x-2",
        iconWithTextDescription: "space-x-4 p-4 border border-gray-200",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
);

export interface TechnologyCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof technologyCardVariants> {
  technology: Technology;
  asChild?: boolean;
}

const TechnologyCard = React.forwardRef<HTMLDivElement, TechnologyCardProps> (
  ({ technology, className, variant, asChild = false, ...props }, ref) => {
    const {selectedProject, setSelectedProject} = useMainStore();
    const [loading, setLoading] = useState(false);
    const Comp = asChild ? Slot : "div";
    
    async function handleAddTechnology() {
      if (!selectedProject) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        return
      }
      setLoading(true)
      const project = await updateProjectTechnologies(selectedProject.id, technology)
      console.log('[Technology Card] Project', project)

      setSelectedProject({...project!, previous: selectedProject.previous, next: selectedProject.next});
      setLoading(false)
    }

    async function handleRemove(technology: Technology) {
      console.log("Removing")
      const project = await removeTechnology(selectedProject?.id, technology)
      setSelectedProject({previous: selectedProject.previous, next: selectedProject.next, ...project})
    }

    const isTechnologyAdded = selectedProject?.technologies.some(t => t.id === technology.id);

    return (
      <Comp className={cn(technologyCardVariants({ variant, className }))} ref={ref} {...props}>
        <Image src={technology.logo} width={30} height={30} alt={technology.name} />
        {(variant === "iconWithText" || variant === "iconWithTextDescription") && (
          <div>{technology.name}</div>
        )}
        {variant === "iconWithTextDescription" && (
          <>
            <div>{technology.description}</div>
            {loading ? (
              <ButtonLoading />
            ) : (
              !isTechnologyAdded ? (
                <Button onClick={handleAddTechnology}>
                  Add Technology
                </Button>
              ) : (
                <Button
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                  onClick={() => handleRemove(technology)}
                >
                  Remove
                </Button>
              )
            )}
          </>
        )}
      </Comp>
    );
  }
);

TechnologyCard.displayName = "TechnologyCard";
export { TechnologyCard, technologyCardVariants };
  

interface TechnologiesContextProps {
    variant: "icon" | "iconWithText" | "iconWithTextDescription";
    technologies: Technology[];
  }


export function TechnologiesContext({ variant, technologies }: TechnologiesContextProps) {
  return (
    <div>
      {technologies ? (
        <div className="grid grid-cols-3 gap-4">
          {technologies.map((technology, index) => (
            <div key={index}>
              <TechnologyCard
                technology={technology}
                variant={variant}
              />
            </div>
          ))}
        </div>
      ) : (
        <Button variant={"outline"}>Add technologies</Button>
      )}
    </div>
  );
}

  export function TechnologySearch() {
    const {technologies, setTechnologies} = useMainStore((state) => ({technologies: state.technologies, setTechnologies: state.setTechnologies}))
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
  
    useEffect(() => {
      if (technologies.length === 0) {
        console.log("[Tech Search] Inital Render, Fetching")
        fetchTechnologies();
      }
    }, []);
  
    async function fetchTechnologies() {
      const techs = await getAllTechnologies();
      setTechnologies(techs);
      setLoading(false);
    }

    // if (loading) {
    //   return <ButtonLoading></ButtonLoading>
    // }
  
    function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
      setSearchTerm(e.target.value);
    }
  
    const filteredTechnologies = technologies?.filter((technology) =>
      technology.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div>
        <Input
          type="text"
          placeholder="Search technologies"
          onChange={inputHandler}
          className="p-2 border rounded"
        />
        
        <TechnologiesContext
          variant="iconWithTextDescription"
          technologies={filteredTechnologies}
        />
      </div>
    );
  }