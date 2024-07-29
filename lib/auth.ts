"use server"
import prisma from "@/lib/prisma";
import { createClient } from "./utils/supabase-server";
import { User } from "./types";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export async function getSession(): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email,
    phone: data.user.phone
  };
}

// TODO: See if this is necessary to be different compared to withPostAuth (i.e. can they be merged)
export async function withSiteAuth(action: any) {
  return async (
    formData: FormData | null,
    siteId: string,
    key: string | null,
  ) => {
    const supabase = createClient();
    const {data, error} = await supabase.auth.getUser();

    if (!data.user?.id) {
      return {
        error: "Not authenticated",
      };
    }
    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
    });
    if (!site || site.userId !== data.user.id) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, site, key);
  };
}

export async function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    postId: string,
    key: string | null,
  ) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser()

    if (!data.user?.id) {
      return {
        error: "Not authenticated",
      };
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        site: true,
      },
    });
    if (!post || post.userId !== data.user.id) {
      return {
        error: "Post not found",
      };
    }

    return action(formData, post, key);
  };
}
