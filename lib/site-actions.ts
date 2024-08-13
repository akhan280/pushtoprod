"use server"
import prisma from "@/lib/prisma";
import { Post, Site } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
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
import { LocalSiteData } from "../app/app/(dashboard)/site/types";
import { error } from "console";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
);


export async function updateSiteJSON(siteData: LocalSiteData & { sections: string }) {
  console.log(`[SERVER ACTION] Updating Site log`, siteData)
  try {
    const updatedSite = await prisma.site.update({
      where: { id: siteData.id },
      data: {
        name: siteData.name,
        description: siteData.description,
        logo: siteData.logo,
        font: siteData.font,
        image: siteData.image,
        imageBlurhash: siteData.imageBlurhash,
        subdomain: siteData.subdomain,
        customDomain: siteData.customDomain,
        message404: siteData.message404,
        sections: siteData.sections 
      }
    });

    revalidatePath(`/site/${siteData.id}`);
    return { success: true, site: updatedSite };
  } catch (error) {
    console.error('Failed to update site:', error);
    return { success: false, error: 'Failed to update site' };
  }
}

export const createSite = async (formData: FormData) => {
  console.log("[Server Action] Starting createSite function.");

  const session = await getSession();
  if (!session?.id) {
    console.log("[Server Action] Not authenticated.");
    return {
      error: "Not authenticated",
    };
  }
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;

  console.log("[Server Action] Received form data:", {
    name,
    description,
    subdomain,
  });

  try {
    console.log("[Server Action] Attempting to create site in the database.");
    const response = await prisma.site.create({
      data: {
        name,
        description,
        subdomain,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
    });

    const data = await prisma.user.update({
      where: {
        id: session.id
      },
      data: {
        siteId: response.id
      }
    })

    console.log("[Server Action] Site created successfully:", response);

    const metadataTag = `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`;
    console.log("[Server Action] Revalidating metadata tag:", metadataTag);
    revalidateTag(metadataTag);

    return response;
  } catch (error: any) {
    console.error("[Server Action] Error occurred:", error);

    if (error.code === "P2002") {
      console.log("[Server Action] Subdomain already taken:", subdomain);
      return {
        error: `This subdomain is already taken`,
      };
    } else {
      console.log("[Server Action] General error:", error.message);
      return {
        error: error.message,
      };
    }
  }
};


export const updateSite = async (formData: FormData, site: Site, key: string) => {
    const data = await getSession();

    if (!data?.id) {
      return {
        error: "Not authenticated",
      };
    }
    
    const currentSite = await prisma.site.findUnique({
      where: {
        id: site.userId!,
      },
    });

    if (!currentSite || currentSite.userId !== data.id) {
      return {
        error: "Not authorized",
      };
    }
    
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          return {
            error: "Cannot use vercel.pub subdomain as your custom domain",
          };
        } else if (validDomainRegex.test(value)) {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: value,
            },
          });
          await Promise.all([addDomainToVercel(value)]);
        } else if (value === "") {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: null,
            },
          });
        }

        if (site.customDomain && site.customDomain !== value) {
          await removeDomainFromVercelProject(site.customDomain);
        }

      } else if (key === "image" || key === "logo") {

        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          return {
            error:
              "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd",
          };
        }

        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = key === "image" ? await getBlurDataURL(url) : null;

        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          },
        });
      } else {

        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: value,
          },
        });
      }

      console.log(
        "Updated site data! Revalidating tags: ",
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${site.customDomain}-metadata`
      );
      revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
      );
      site.customDomain &&
        revalidateTag(`${site.customDomain}-metadata`);

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  }


  type GetAllColumnProjectsProp = {
    columnToProject: {
      section: string; 
      projects: { title: string; description: string; id: string; display: boolean }[];
    }[];
    error: any;
  };
  
  export const getAllColumnProjects = async (): Promise<GetAllColumnProjectsProp> => {
    const session = await getSession();
    
    if (!session?.id) {
      return {
        columnToProject: [],
        error: "Not authenticated",
      };
    }
  
    try {
      const allUserProjects = await prisma.project.findMany({
        where: {
          collaborators: {
            some: {
              userId: session.id,
            },
          },
        },
        select: {
          title: true,
          description: true,
          columnId: true,
          id: true,
          display: true,
        }
      });
  
      const columnToProjects: Map<string, { id: string; title: string; description: string; display: boolean }[]> = new Map();
  
      allUserProjects.forEach((project) => {
        const { columnId } = project;
  
        if (columnToProjects.has(columnId)) {
          columnToProjects.get(columnId)?.push({
            id: project.id,
            title: project.title || '',
            description: project.description || '',
            display: project.display || false
          });
        } else {
          columnToProjects.set(columnId, [{
            id: project.id,
            title: project.title || '',
            description: project.description || '',
            display: project.display || false
          }]);
        }
      });
  
      const result = Array.from(columnToProjects, ([section, projects]) => ({
        section,
        projects,
      }));
  
      console.log('Mapped column ids', result);
  
      return {
        columnToProject: result,
        error: '',
      };
  
    } catch (error: unknown) {
      console.log('error', error);
      if (error instanceof PrismaClientKnownRequestError) {
        return {
          columnToProject: [],
          error: error.message,
        };
      }
      return {
        columnToProject: [],
        error: "An unexpected error occurred",
      };
    }
  };  
  

export const getMultipleProjects = async (projectIds: string[]): Promise<any> => {
  const session = await getSession();
  if (!session?.id) {
    return {
      projects: [],
      error: "Not authenticated",
    };
  }

  try {
    const allUserProjects = await prisma.project.findMany({
      where: {
        collaborators: {
          some: {
            userId: session.id,
          },
        },
      },
      select: {
        title: true,
        description: true,
        columnId: true,
        id: true,
        display: true,
      }
    });

    console.log(`[All of User's Projects]`, allUserProjects)

    const allProjects = allUserProjects
      .map(project => ({
        id: project.id,
        title: project.title || "Untitled",
        description: project.description || "description",
        columnId: project.columnId,
        display: project.display 
      }));
    
    console.log(`[allProjects]`, allProjects)
    const projects = allProjects.filter(project => projectIds.includes(project.id) && project.display !== false)

    console.log(`[projects]`, projects)


    type HiddenProjectsCount = {[key: string]: number}
    const hiddenProjectsCount: (HiddenProjectsCount) = allUserProjects
      .filter(project => project.display === false)
      .reduce((acc, project) => {
        acc[project.columnId] = (acc[project.columnId] || 0) + 1;
        return acc;
    }, {} as HiddenProjectsCount);

    console.log(`hiddenProjectCounts`, hiddenProjectsCount)

    return {
      projects,
      hiddenProjectsCount,
      error: null,
    };

  } catch (error: unknown) {
    console.log('error', error)
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        projects: [],
        error: error.message,
      };
    }
    return {
      projects: [],
      error: "An unexpected error occurred",
    };
  }
};

// export const deleteSite = withSiteAuth(async (_: FormData, site: Site) => {
//   try {
//     const response = await prisma.site.delete({
//       where: {
//         id: site.id,
//       },
//     });
//     revalidateTag(
//       `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
//     );
//     response.customDomain &&
//       revalidateTag(`${site.customDomain}-metadata`);
//     return response;
//   } catch (error: any) {
//     return {
//       error: error.message,
//     };
//   }
// });

export const getSiteFromPostId = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      siteId: true,
    },
  });
  return post?.siteId;
};

// export const createPost = withSiteAuth(async (_: FormData, site: Site) => {
//   const session = await getSession();
//   if (!session?.id) {
//     return {
//       error: "Not authenticated",
//     };
//   }
//   const response = await prisma.post.create({
//     data: {
//       siteId: site.id,
//       userId: session.id,
//     },
//   });

//   revalidateTag(
//     `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`
//   );
//   site.customDomain && revalidateTag(`${site.customDomain}-posts`);

//   return response;
// });

export const updatePost = async (data: Post) => {
  const session = await getSession();
  if (!session?.id) {
    return {
      error: "Not authenticated",
    };
  }
  const post = await prisma.post.findUnique({
    where: {
      id: data.id,
    },
    include: {
      site: true,
    },
  });
  if (!post || post.userId !== session.id) {
    return {
      error: "Post not found",
    };
  }
  try {
    const response = await prisma.post.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
      },
    });

    revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`
    );
    revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`
    );

    post.site?.customDomain &&
      (revalidateTag(`${post.site?.customDomain}-posts`),
      revalidateTag(`${post.site?.customDomain}-${post.slug}`));

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

// export const updatePostMetadata = withPostAuth(
//   async (
//     formData: FormData,
//     post: Post & {
//       site: Site;
//     },
//     key: string
//   ) => {
//     const value = formData.get(key) as string;

//     try {
//       let response;
//       if (key === "image") {
//         const file = formData.get("image") as File;
//         const filename = `${nanoid()}.${file.type.split("/")[1]}`;

//         const { url } = await put(filename, file, {
//           access: "public",
//         });

//         const blurhash = await getBlurDataURL(url);

//         response = await prisma.post.update({
//           where: {
//             id: post.id,
//           },
//           data: {
//             image: url,
//             imageBlurhash: blurhash,
//           },
//         });
//       } else {
//         response = await prisma.post.update({
//           where: {
//             id: post.id,
//           },
//           data: {
//             [key]: key === "published" ? value === "true" : value,
//           },
//         });
//       }

//       revalidateTag(
//         `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`
//       );
//       revalidateTag(
//         `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`
//       );

//       post.site?.customDomain &&
//         (revalidateTag(`${post.site?.customDomain}-posts`),
//         revalidateTag(`${post.site?.customDomain}-${post.slug}`));

//       return response;
//     } catch (error: any) {
//       if (error.code === "P2002") {
//         return {
//           error: `This slug is already in use`,
//         };
//       } else {
//         return {
//           error: error.message,
//         };
//       }
//     }
//   }
// );

// export const deletePost = withPostAuth(async (_: FormData, post: Post) => {
//   try {
//     const response = await prisma.post.delete({
//       where: {
//         id: post.id,
//       },
//       select: {
//         siteId: true,
//       },
//     });
//     return response;
//   } catch (error: any) {
//     return {
//       error: error.message,
//     };
//   }
// });

// export const editUser = async (
//   formData: FormData,
//   _id: unknown,
//   key: string
// ) => {
//   const session = await getSession();
//   if (!session?.id) {
//     return {
//       error: "Not authenticated",
//     };
//   }
//   const value = formData.get(key) as string;

//   try {
//     const response = await prisma.user.update({
//       where: {
//         id: session.id,
//       },
//       data: {
//         [key]: value,
//       },
//     });
//     return response;
//   } catch (error: any) {
//     if (error.code === "P2002") {
//       return {
//         error: `This ${key} is already in use`,
//       };
//     } else {
//       return {
//         error: error.message,
//       };
//     }
//   }
// };
