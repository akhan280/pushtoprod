import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getSession } from "../../lib/auth";
import { Project } from "../../lib/types";
import { KanbanBoard } from "./kanban";
import { getProjects } from '../../lib/actions'

export async function KanbanFetcher() {
    const response = await getProjects();
    const projects = response.projects ?? [];

    const dummyProjects: Project[] = [
        {
          id: "1",
          title: "Project 1",
          description: "Description for project 1",
          columnId: "ideas",
          collaborators: [
            {
              id: "collab1",
              email: "collab1@example.com",
              name: "Collaborator 1",
              username: "collab1",
              gh_username: "gh_collab1",
              image: "https://example.com/image1.png",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          notes: "Notes for project 1",
          technologies: "React, Node.js",
          githuburl: "https://github.com/project1",
        },
        {
          id: "2",
          title: "Project 2",
          description: "Description for project 2",
          columnId: "development",
          collaborators: [
            {
              id: "collab2",
              email: "collab2@example.com",
              name: "Collaborator 2",
              username: "collab2",
              gh_username: "gh_collab2",
              image: "https://example.com/image2.png",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          notes: "Notes for project 2",
          technologies: "Vue, Django",
          githuburl: "https://github.com/project2",
        },
        {
          id: "3",
          title: "Project 4",
          description: "Description for project 3",
          columnId: "to-launch",
          collaborators: [
            {
              id: "collab3",
              email: "collab3@example.com",
              name: "Collaborator 3",
              username: "collab3",
              gh_username: "gh_collab3",
              image: "https://example.com/image3.png",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          notes: "Notes for project 3",
          technologies: "Angular, .NET",
          githuburl: "https://github.com/project3",
        },
      ];

      console.log("dmu",dummyProjects)
      
    return (
        <KanbanBoard fetchedProjects = {dummyProjects}></KanbanBoard>
    )
}