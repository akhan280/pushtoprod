"use client";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { useEffect, useState, FormEvent } from "react";
import LoadingDots from "../ui/loading-ui/loading-dots";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import useMainStore from "../../lib/hooks/use-main-store";
import { createSite, updateSite } from "../../lib/site-actions";
import Form from "../form";
import { toast } from "../ui/use-toast";

interface CreateSiteData {
  name: string;
  subdomain: string;
  domain: string;
  description: string;
}

export default function CreateSiteModal() {
  const router = useRouter();
  const modal = useModal();
  const { setSite, setOnboardingStep } = useMainStore();

  const [data, setData] = useState<CreateSiteData>({
    name: "",
    subdomain: "",
    domain: "",
    description: "",
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      subdomain: prev.name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, "-"),
    }));
  }, [data.name]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("subdomain", data.subdomain);
    formData.append("domain", data.domain);
    formData.append("description", data.description);

    console.log('Click registered', data)

    await createSite(formData).then((res: any) => {
      if (res.error) {
        console.log('[ERROR]', res.error)
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${res.error}`,
        });
      } else {
        va.track("Created Site");
        console.log(`[Created Site] Site Returned,`, res);
        setSite(res)
        
        const { id } = res;
        
        toast({
          variant: "default",
          title: "Site successfully created",
        });

        setOnboardingStep(4);

        }
    })
  };

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700">
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-stone-500 dark:text-stone-400">
            Your portfolio's title
          </label>
          <input
            name="name"
            type="text"
            placeholder="Site Name"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>

        <Tabs defaultValue="subdomain" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subdomain">Subdomain</TabsTrigger>
            <TabsTrigger value="custom-domain">Custom Domain</TabsTrigger>
          </TabsList>
          <TabsContent value="subdomain">
            <div className="flex flex-col space-y-2">
              <label htmlFor="subdomain" className="text-sm font-medium text-stone-500 dark:text-stone-400">
                Subdomain
              </label>
              <input
                name="subdomain"
                type="text"
                placeholder="yoursubdomain"
                value={data.subdomain}
                onChange={(e) => setData({ ...data, subdomain: e.target.value })}
                maxLength={64}
                pattern="^[a-z0-9]+([\\-]{1}[a-z0-9]+)*$"
                className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
              />
            </div>
          </TabsContent>
          <TabsContent value="custom-domain">
            <div className="flex flex-col space-y-2">
              <label htmlFor="domain" className="text-sm font-medium text-stone-500 dark:text-stone-400">
                Custom Domain
              </label>
              <input
                name="domain"
                type="text"
                placeholder="yourdomain.com"
                value={data.domain}
                onChange={(e) => setData({ ...data, domain: e.target.value })}
                maxLength={64}
                pattern="^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}$"
                className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-stone-500">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description about why my site is so awesome"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={140}
            rows={3}
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CreateSiteFormButton />
      </div>
    </form>
  );
}

function CreateSiteFormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Create Site</p>}
    </button>
  );
}
