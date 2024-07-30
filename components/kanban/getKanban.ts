"use server"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getSession } from "../../lib/auth";
import { Project } from "../../lib/types"; 
import prisma from "@/lib/prisma";
import { ColumnId } from "./kanban";

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
