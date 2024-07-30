"use server"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getSession } from "../../lib/auth";
import { Project } from "../../lib/types"; 
import prisma from "@/lib/prisma";


export const getProjects = async (): Promise<{projects: Project[] | null, error: string | null}> => {
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
              user: true,
            },
          },
        },
      });
      return {
        projects,
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
