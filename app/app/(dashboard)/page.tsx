"use server"
import { KanbanBoard } from "../../../components/kanban/kanban";
import NavigationComponent from "../../../components/nav-bar";
import { getProjects, getUser } from "../../../lib/actions";

export default async function Overview() {
  const response = await getProjects();
  const projects = response.projects ?? [];
  const data = await getUser();

  console.log("[Kanban] Fetched items", projects.length);

  return (
    <div className="flex min-h-screen flex-col">
        <KanbanBoard fetchedProjects={projects} fetchedUser={data.user!} />
    </div>
  );
}
