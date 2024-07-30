import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getSession } from "../../lib/auth";
import { Project } from "../../lib/types";
import { KanbanBoard } from "./kanban";
import { getProjects } from "./getKanban";

export async function KanbanFetcher() {
    const response = await getProjects();
    return (
        <KanbanBoard fetchedProjects = {response.projects}></KanbanBoard>
    )
}