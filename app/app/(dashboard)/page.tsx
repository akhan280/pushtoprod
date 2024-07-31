import { Suspense } from "react";
import Sites from "@/components/sites";
import OverviewStats from "@/components/overview-stats";
import Posts from "@/components/posts";
import Link from "next/link";
import PlaceholderCard from "@/components/placeholder-card";
import OverviewSitesCTA from "@/components/overview-sites-cta";
import { KanbanBoard } from "../../../components/kanban/kanban";
import { KanbanFetcher } from "@/components/kanban/kanbanLayout";
import { getProjects } from "../../../lib/actions";


export default async function Overview() {
  // const addOneUser = async () => {
  //   try {
  //     const result = await addUser(userData);
  //     if (result.error) {
  //       console.error("Error adding user:", result.error);
  //     } else {
  //       console.log("New user added:", result.user);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  const response = await getProjects();
  const projects = response.projects ?? [];

  console.log('[Kanban] Fetched items', projects.length)

  return (
    <div className="flex flex-col">
    

      <div className="flex flex-col pt-32">

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <div className="min-h-screen">
            <KanbanBoard fetchedProjects={projects}/>
          </div>
        </Suspense>
      </div>

      
    </div>
  );
}
