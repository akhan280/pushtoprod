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


export const createProject = async (projectData: Omit<Project, 'id'>) => {
  const session = await getSession();
  if (!session?.id) {
    return {
      project: null,
      error: "Not authenticated",
    };
  }

  try {
    const userId = session.id;
    const project = await prisma.project.create({
      data: {
        ...projectData,
        collaborators: {
          connect: [{ id: userId }],
        },
      },
      include: {
        collaborators: {
          select: {
            user: true,
          },
        },
      },
    });
    return {
      project,
      error: null,
    };
  } catch (error: unknown) {
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