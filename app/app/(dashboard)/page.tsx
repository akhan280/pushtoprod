import { Suspense } from "react";
import PlaceholderCard from "@/components/placeholder-card";
import { KanbanBoard } from "../../../components/kanban/kanban";
import { getProjects, getUser } from "../../../lib/actions";
import AddProjectDialog from "../../../components/dialog/add-project-dialog";
import Profile from "../../../components/profile";

export default async function Overview() {
  const response = await getProjects();
  const projects = response.projects ?? [];
  const data = await getUser();

  console.log("[Kanban] Fetched items", projects.length);

  return (

      <div className="flex flex-col">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <>
                <PlaceholderCard key={i} />
                </>
              ))}
            </div>
          }
        >
          <div className="min-h-screen">
            <div className="flex flex-row ml-auto">
               <Profile fetchedUser = {data.user!} />
             </div>
            <KanbanBoard fetchedProjects={projects} fetchedUser = {data.user!} />
            <AddProjectDialog></AddProjectDialog>
          </div>
        </Suspense>
      </div>

  );
}
