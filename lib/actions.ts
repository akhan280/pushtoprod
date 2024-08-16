"use server"
import prisma from "@/lib/prisma";
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
import { ColumnId } from "@/components/kanban/kanban";
import { ProjectMovement } from "./hooks/kanban-slice";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";
import { Project, Technology, User } from "./types";
import { Configuration, OpenAIApi } from "openai-edge";
// const nanoid = customAlphabet(
//   "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
//   7,

import OpenAI from "openai"

export async function PopulateSupabase() {
  const data = {
    tech1: {
      name: 'C++',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/sign/technology-logos/c++-1.png',
      description: 'C++ is a general-purpose programming language created as an extension of the C programming language, or "C with Classes". It has imperative, object-oriented and generic programming features, while also providing facilities for low-level memory manipulation.'
    },
    tech2: {
      name: 'C',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/c.png',
      description: 'C is a general-purpose programming language that was developed to provide low-level access to memory and language constructs that map efficiently to machine instructions, making it suitable for system programming like operating system or compiler development.'
    },
    tech3: {
      name: 'CSS',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/css.png',
      description: 'CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of a document written in HTML or XML. CSS describes how elements should be rendered on screen, on paper, in speech, or on other media.'
    },
    tech4: {
      name: 'Firebase',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/firebase.png',
      description: 'Firebase is a platform developed by Google for creating mobile and web applications. It offers a real-time database, authentication, hosting, cloud functions, and other backend services to simplify the development process.'
    },
    tech5: {
      name: 'HTML',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/html.png',
      description: 'HTML (HyperText Markup Language) is the standard markup language used for creating web pages. It describes the structure of a web page and its contents, including text, images, links, and other multimedia elements.'
    },
    tech6: {
      name: 'Java',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/java.png',
      description: 'Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. It is intended to let application developers write once, run anywhere (WORA), meaning that compiled Java code can run on all platforms that support Java without the need for recompilation.'
    },
    tech7: {
      name: 'JavaScript',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/javascript.png',
      description: 'JavaScript is a versatile programming language that conforms to the ECMAScript specification. It is used alongside HTML and CSS to create dynamic web pages, and it is a core technology of the World Wide Web.'
    },
    tech8: {
      name: 'Java',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/java.png',
      description: 'Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. It is intended to let application developers write once, run anywhere (WORA), meaning that compiled Java code can run on all platforms that support Java without the need for recompilation.'
    },
    tech9: {
      name: 'MongoDB',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/mongodb.png',
      description: 'MongoDB is a document-oriented NoSQL database used for high-volume data storage. Instead of using tables and rows as in traditional relational databases, MongoDB makes use of collections and documents.'
    },
    tech10: {
      name: 'Next.js',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/next.png',
      description: 'Next.js is a React framework that enables functionality such as server-side rendering and generating static websites for React-based web applications. It is designed to provide an out-of-the-box experience for building web applications with React.'
    },
    tech11: {
      name: 'Python',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/python.png',
      description: 'Python is an interpreted, high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. It provides constructs that enable clear programming on both small and large scales.'
    },
    tech12: {
      name: 'PHP',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/php.png',
      description: 'PHP is a popular general-purpose scripting language that is especially suited to web development. It was originally created by Danish-Canadian programmer Rasmus Lerdorf in 1994. The PHP reference implementation is now produced by The PHP Group.'
    },
    tech13: {
      name: 'Node.js',
      logo: 'https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/nodejs.png',
      description: 'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser. It is used to build scalable network applications.'
    },
  };

  for (const tech of Object.values(data)) {
    try {
      const response = await prisma.technology.create({
        data: tech,
      });
      console.log(`Inserted technology: ${tech.name}`);
    } catch (error) {
      console.error(`Error inserting technology: ${tech.name}`, error);
    }
  }
}

export async function getAllTechnologies(): Promise<Technology[]> {
    try {
      console.log('[Server Action] Fetching All Technologies')
      const response = await prisma.technology.findMany({});
      return response;
    } catch (error) {
      console.error(`Error inserting technology:`, error);
      return [];
    }
}

export async function updateProjectTechnologies(projectId: string, technology: Technology) {

  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        technologies: {
          connectOrCreate: {
            where: { id: technology.id },
            create: {
              id: technology.id,
              name: technology.name,
              logo: technology.logo,
              description: technology.description,
            },
          },
        },
      },
      include: {
        collaborators: {
          include: {
            user: true,
          },
        },
        technologies: true,
      },
    }) ;
    return updatedProject;
  } catch (error) {
    console.error("Error updating project technologies:", error);
  }
}

export async function removeTechnology(projectId: string, technology: Technology){
  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        technologies: {
          disconnect: {
            id: technology.id,
          },
        },
      },
      include: {
        collaborators: {
          include: {
            user: true,
          },
        },
        technologies: true,
      },
    });
    return updatedProject;
  } catch (error) {
    console.error("Error removing technology from project:", error);
    throw new Error("Failed to remove technology");
  }
}

//TODO: MAKE ASYNC
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

export const getUser = async () => {
  const session = await getSession();
  if (!session?.id) {
    console.log("[USER RETRIEVAL] Not authenticated");
    return {
      user: null,
      error: "Not authenticated",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
    });

    if (!user) {
      console.log("[USER RETRIEVAL] User not found");
      return { user: null, error: "User not found" };
    }

    console.log("[USER STATUS] Retrieved user:", user);
    return { user, error: null };
  } catch (error: any) {
    console.error("[USER RETRIEVAL] Error retrieving user:", error);
    return {
      user: null,
      error: "An unexpected error occurred",
    };
  }
};

export const updateUserField = async (userId: string, key: string, value: any) => {
  const session = await getSession();
  if (!session?.id) {
    return {
      user: null,
      error: "Not authenticated",
    };
  }

  console.log(`Updating user ${userId} with ${key} to ${value}`);

  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        [key]: value,
      },
    });

    return { user: user, error: null };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return {
      user: null,
      error: "An unexpected error occurred",
    };
  }
};

export const updateProjectField = async (projectId: string, key: string, value: string) => {
  
  const session = await getSession();
  if (!session?.id) {
    return {
      project: null,
      error: "Not authenticated",
    };
  }

  console.log(`updating project ${projectId} WITH ${key} to ${value}`);

  try {
    const project = await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        [key]: value,
      }
    })
    
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

  console.log("Projects", projectData)

  try {
    const userId = session.id;
    console.log("uid", userId)

    const project = await prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description,
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
                paid: true,
                siteReferral: true,
                siteId: true,
                managedAI: true,
              },
            },
          },

        },
        technologies: true,
      },
    });

    // Transform the data to match the Project type
    const transformedProjects: Project[] = projects?.map((project) => ({
      ...project,
      collaborators: project.collaborators.map((collaborator) => ({
        user: {
          id: collaborator.user.id,
          email: collaborator.user.email,
          name: collaborator.user.name,
          username: collaborator.user.username,
          gh_username: collaborator.user.gh_username,
          image: collaborator.user.image,
          createdAt: collaborator.user.createdAt,
          updatedAt: collaborator.user.updatedAt,
          paid: collaborator.user.paid,
          siteId: collaborator.user.siteId ?? '',
          siteReferral: collaborator.user.siteReferral ?? [],
          managedAI: collaborator.user.managedAI,
        }
      })),
      technologies: project.technologies ?? null,
      githuburl: project.githuburl ?? null,
      websiteurl: project.websiteurl ?? null,
      tags: project.tags ?? [],
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

export const getSingularProject = async (projectId: string): Promise<{ project: Project | null, error: string | null }> => {
  const session = await getSession();
  if (!session?.id) {
    return {
      project: null,
      error: "Not authenticated",
    };
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: decodeURIComponent(projectId),
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
                paid: true,
                siteReferral: true,
                siteId: true,
                managedAI: true,
              },
            },
          },
        },
        technologies: true,
      },
    });

    if (!project) {
      return {
        project: null,
        error: "Project not found",
      };
    }

    const transformedProject: Project = {
      ...project,
      collaborators: project.collaborators.map((collaborator) => ({
        user: {
          id: collaborator.user.id,
          email: collaborator.user.email,
          name: collaborator.user.name,
          username: collaborator.user.username,
          gh_username: collaborator.user.gh_username,
          image: collaborator.user.image,
          createdAt: collaborator.user.createdAt,
          updatedAt: collaborator.user.updatedAt,
          paid: collaborator.user.paid,
          siteId: collaborator.user.siteId ?? ``,
          siteReferral: collaborator.user.siteReferral,
          managedAI: collaborator.user.managedAI,
        },
      })),
      technologies: project.technologies ?? null,
      githuburl: project.githuburl ?? null,
      websiteurl: project.websiteurl ?? null,
      tags: project.tags ?? [],
      columnId: project.columnId as ColumnId,
    };

    return {
      project: transformedProject,
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



export const updateEditor = async (editor: any, projectId: string) => {
  console.log("[COL ID] is:", projectId);

  const session = await getSession();
  if (!session?.id) {
    return {
      project: null,
      error: "Not authenticated",
    };
  }

  try {
    console.log("[updateEditor Server Action]", editor);

    const response = await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        textEditor: editor
      },
      include: {
        collaborators: {
          include: {
            user: true,
          },
        },
        technologies: true,
      },
    })

    console.log("[updateEditor Server Action]", response);


    return { project: response };
  } catch (error: any) {
    console.log('[An error occured saving the editor]', error)
    return { success: false, error: 'Failed to update Excalidraw data' };
  }
}


export async function updateExcalidrawData(projectId: string, data: ImportedDataState) {
  console.log('[Server Action] Updating Excalidraw Data', projectId, data);
  
  try {
    const serializedData = JSON.stringify(data);

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        excalidrawEditor: serializedData,
      },
      include: {
        collaborators: {
          include: {
            user: true,
          },
        },
        technologies: true,
      },
    });
    return { project: project };
  } catch (error) {
    console.error('Failed to update Excalidraw data:', error);
    return { success: false, error: 'Failed to update Excalidraw data' };
  }
}

export async function updateMermaidSchema(projectId: string, data: string) {
  console.log('[Server Action] Updating Mermaid Data', projectId, data);
  
  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        mermaidSchema: data,
      },
      include: {
        collaborators: {
          include: {
            user: {
              include: {
                site: true,
              }
            },
          },
        },
        technologies: true,
      },
    });
    return { project: project };
  } catch (error) {
    console.error('Failed to update Mermaid data:', error);
    return { success: false, error: 'Failed to update mermaid data' };
  }
}



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Access the API key from environment variables
});


export async function generateContent(platformId: string, projectId: string, title: string, description: string) {
  try {
    // Step 1: Generate the content using OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a highly skilled AI assistant specializing in creating marketing content tailored to various online platforms. 
                    Your task is to generate engaging and effective marketing content based on the following details:
                    - Platform: ${platformId}
                    - Project Title: ${title}
                    - Project Description: ${description}
    
                    The content should be concise, compelling, and suitable for the platform, taking into consideration the platform's audience and format. 
                    Ensure the content aligns with best practices for the platform and is optimized to drive engagement and interest in the project.`,
        },
        {
          role: "user",
          content: `Please generate marketing content for the platform based on the project's title "${title}" and the description: "${description}".`,
        },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
      n: 1,
    });

    const generatedContent = completion.choices[0].message.content;

    // Step 2: Save the generated content to the database
    const session = await getSession();
    if (!session?.id) {
      return {
        project: null,
        error: "Not authenticated",
      };
    }

    const newGeneratedContent = { [platformId]: generatedContent };

    const response = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        generatedContent: {
          push: newGeneratedContent, // Add new content to the generatedContent array
        },
      },
      include: {
        collaborators: {
          include: {
            user: true,
          },
        },
        technologies: true,
      },
    });

    console.log("[generateAndSaveContent Server Action]", response);

    return { success: true, generatedContent: generatedContent };

  } catch (error: any) {
    console.error('[An error occurred while generating and saving content]', error);
    return { success: false, error: 'Failed to generate or save content' };
  }
}
