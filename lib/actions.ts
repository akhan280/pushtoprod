"use server"
import prisma from "@/lib/prisma";
import { Post, Site } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withPostAuth, withSiteAuth } from "./auth";
import { getSession } from "@/lib/auth";
import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex,
} from "@/lib/domains";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "@/lib/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Project } from "./types";
import { ColumnId } from "@/components/kanban/kanban";

// const nanoid = customAlphabet(
//   "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
//   7,
// );

export const updateProjectStatus = async (id: string, columnId: string) => {

  console.log("[COL ID] is:", columnId);

  const session = await getSession();
  if (!session?.id) {
    return {
      project: null,
      error: "Not authenticated",
    };
  }

  try {
    const project = await prisma.project.update({
      where: {
        id: id,
      },
      data: {
        columnId: columnId
      }
    })
    
    console.log("[PROJECT STATUS] is:", project)
    return {project: project, error: null}
  } catch (error: any) {
    console.error("Error updating project:", error);
    return {
      project: null,
      error: "An unexpected error occurred",
    };
  }
}


export const createProject = async (projectData: Omit<Project, 'id'>) => {
  const session = await getSession();
  if (!session?.id) {
    return {
      project: null,
      error: "Not authenticated",
    };
  }

  console.log("PJS", projectData)
  

  try {
    const userId = session.id;
    console.log("uid", userId)

    const project = await prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description,
        notes: projectData.notes,
        technologies: projectData.technologies,
        githuburl: projectData.githuburl,
        columnId: projectData.columnId,
      }
    });

    // Step 2: Connect the collaborator to the project
    await prisma.projectCollaborator.create({
      data: {
        userId: userId,
        projectId: project.id
      }
    });

    // Fetch the project with the collaborators included
    const projectWithCollaborators = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        collaborators: {
          select: {
            user: true
          }
        }
      }
    });

    return { project: projectWithCollaborators };

  } catch (error: unknown) {
    console.error("Error creating project:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        project: null,
        error: error.message,
      };
    }
    return {
      project: null,
      error: "An unexpected error occurred",
    };
  }
};

export const getProjects = async (): Promise<{ projects: Project[] | null, error: string | null }> => {
  const session = await getSession();
  if (!session?.id) {
    return {
      projects: null,
      error: "Not authenticated",
    };
  }

  try {
    const userId = session.id;
    const projects = await prisma.project.findMany({
      where: {
        collaborators: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        collaborators: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true,
                gh_username: true,
                image: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    // Transform the data to match the Project type
    const transformedProjects: Project[] = projects?.map((project) => ({
      ...project,
      collaborators: project.collaborators.map((collaborator) => ({
        id: collaborator.user.id,
        email: collaborator.user.email,
        name: collaborator.user.name,
        username: collaborator.user.username,
        gh_username: collaborator.user.gh_username,
        image: collaborator.user.image,
        createdAt: collaborator.user.createdAt,
        updatedAt: collaborator.user.updatedAt,
      })),
      notes: project.notes ?? null,
      technologies: project.technologies ?? null,
      githuburl: project.githuburl ?? null,
      columnId: project.columnId as ColumnId,  
    }));


    return {
      projects: transformedProjects,
      error: null,
    };

  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        projects: null,
        error: error.message,
      };
    }
    return {
      projects: null,
      error: "An unexpected error occurred",
    };
  }
};


// export const addUser = async (userData: {
//   id: string;
//   name?: string;
//   username?: string;
//   email: string;
//   gh_username?: string;
//   image?: string;
// }) => {
//   try {
//     const newUser = await prisma.user.create({
//       data: {
//         id: userData.id, // Ensure the user is created with the specified UUID
//         name: userData.name,
//         username: userData.username,
//         email: userData.email,
//         gh_username: userData.gh_username,
//         image: userData.image,
//       },
//     });
//     return {
//       user: newUser,
//       error: null,
//     };
//   } catch (error: unknown) {
//     if (error instanceof PrismaClientKnownRequestError) {
//       return {
//         user: null,
//         error: error.message,
//       };
//     }
//     return {
//       user: null,
//       error: "An unexpected error occurred",
//     };
//   }
// };