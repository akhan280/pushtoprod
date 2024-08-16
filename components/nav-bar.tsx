"use client";
import { usePathname, useRouter, useSelectedLayoutSegments } from "next/navigation";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Dock } from "./ui/dock";
import useMainStore from "../lib/hooks/use-main-store";
import AddNewProject from "./add-new-project";
import Profile from "./profile";

type NavbarProps = {
  site?: boolean;
};
export default function NavigationComponent({ site = false }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { previousUrl, addSection, user } = useMainStore();

  console.log('pathname', pathname)
  if (pathname === '') {

  }


  const basePath = `/site/${pathname.split("/")[2]}`;

  
  function handleAddSection(type: "textbox" | "media") {
    const content = type === "textbox"
      ? {
          content: JSON.stringify([
            { type: "h2", children: [{ text: "🌳 My name is Areeb, I love coding" }] },
            { type: "p", children: [{ text: "Easily create headings of various levels, from H1 to H6, to structure your content and make it more organized." }] },
            { type: "blockquote", children: [{ text: "Create blockquotes to emphasize important information or highlight quotes from external sources." }] },
            { type: "code_block", children: [{ type: "code_line", children: [{ text: "// Use code blocks to showcase code snippets" }] }, { type: "code_line", children: [{ text: "function greet() {" }] }, { type: "code_line", children: [{ text: "  console.info('Hello World!');" }] }, { type: "code_line", children: [{ text: "}" }] }] },
            { type: "p", children: [{ text: "" }] },
          ]),
        }
      : { mediaItems: [] };

    addSection({ id: Date.now(), type, content });
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex h-full max-h-14 origin-bottom">
      <div className="fixed inset-x-0 bottom-0 h-16 w-full bg-background to-transparent backdrop-blur-lg dark:bg-background"></div>

      <Dock className="pointer-events-auto relative z-50 mx-auto flex h-full items-center bg-background px-1 shadow-md dark:border dark:shadow-xl">
        {previousUrl && (
          <Button className="p-2 rounded-xl" onClick={() => router.push(previousUrl)}>
            Go Back
          </Button>
        )}

        {site ? (
          <div className="flex flex-row">
            <Button className="p-2 rounded-xl" onClick={() => router.push("/")}>
              Home
            </Button>
            <Separator orientation="vertical" className="h-full" />
            <Button className="p-2 rounded-xl bg-[#F9F9F9] text-black hover:text-white" onClick={() => handleAddSection("textbox")}>
              Add Text
            </Button>
            <Button className="p-2 rounded-xl bg-[#F9F9F9] text-black hover:text-white" onClick={() => handleAddSection("media")}>
              Add Images
            </Button>
            <Button className="p-2 rounded-xl bg-[#F9F9F9] text-black hover:text-white" onClick={() => handleAddSection("images")}>
              Add Article
            </Button>
            <Button className="flex items-center p-2 rounded-full bg-[#F9F9F9] text-black" onClick={() => router.push(`${basePath}/settings`)}>
              <SettingsIcon />
            </Button>
            <Button className="flex items-center p-2 rounded-full bg-[#F9F9F9] text-black" onClick={() => router.push(`${basePath}/analytics`)}>
              <AnalyticsIcon />
            </Button>
          </div>
        ) : (
          <div className="flex flex-row gap-2">
            <AddNewProject />
            <Button className="p-2 rounded-full" variant="outline">
              <Profile fetchedUser={user!} />
            </Button>
            <Button className="flex items-center p-2 rounded-full bg-[#F9F9F9] text-black" onClick={() => router.push(`/settings`)}>
              <SettingsIcon />
            </Button>
          </div>
        )}
      </Dock>
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.9961 20.3465C11.25 20.3465 11.4941 20.327 11.7578 20.3075L12.3145 21.3719C12.4316 21.5965 12.6367 21.704 12.9102 21.6747C13.1543 21.6258 13.3203 21.4403 13.3594 21.1864L13.5254 20.0047C14.0137 19.868 14.4922 19.6825 14.9512 19.4872L15.8301 20.2782C16.0156 20.454 16.25 20.4833 16.4941 20.3563C16.709 20.2294 16.7969 20.0047 16.748 19.7411L16.5039 18.579C16.9141 18.2958 17.3145 17.9735 17.6758 17.6122L18.7598 18.0614C19.0039 18.1688 19.2383 18.1102 19.4238 17.8954C19.5898 17.7098 19.5996 17.4657 19.4629 17.2411L18.8281 16.2254C19.1211 15.8251 19.3555 15.3758 19.5801 14.9071L20.7812 14.9657C21.0352 14.9852 21.2402 14.8387 21.3281 14.6044C21.4062 14.3602 21.3379 14.1258 21.1328 13.9696L20.1953 13.2274C20.3223 12.7489 20.4199 12.2508 20.4688 11.7235L21.5918 11.3622C21.8457 11.284 21.9922 11.0985 21.9922 10.8348C21.9922 10.5712 21.8457 10.3856 21.5918 10.2977L20.4688 9.94615C20.4199 9.41881 20.3223 8.93053 20.1953 8.44225L21.1328 7.70006C21.3281 7.54381 21.4062 7.3192 21.3281 7.07506C21.2402 6.84068 21.0352 6.6942 20.7812 6.71373L19.5801 6.75279C19.3555 6.28404 19.1211 5.85435 18.8281 5.43443L19.4629 4.41881C19.5996 4.21373 19.5801 3.96959 19.4238 3.78404C19.2383 3.5692 19.0039 3.52037 18.7598 3.61803L17.6758 4.05748C17.3145 3.70592 16.9141 3.37389 16.5039 3.09068L16.748 1.93834C16.8066 1.6649 16.709 1.44029 16.4941 1.3231C16.25 1.18639 16.0156 1.21568 15.8301 1.40123L14.9512 2.18248C14.4922 1.9774 14.0137 1.81139 13.5254 1.6649L13.3594 0.493026C13.3203 0.23912 13.1445 0.0535732 12.9004 0.0047451C12.6367 -0.0245518 12.4219 0.0828701 12.3145 0.297714L11.7578 1.36217C11.4941 1.34264 11.25 1.33287 10.9961 1.33287C10.7324 1.33287 10.498 1.34264 10.2344 1.36217L9.66797 0.297714C9.56055 0.0828701 9.3457 -0.0245518 9.08203 0.0047451C8.83789 0.0535732 8.66211 0.23912 8.63281 0.493026L8.45703 1.6649C7.96875 1.81139 7.5 1.96764 7.03125 2.18248L6.15234 1.40123C5.9668 1.21568 5.73242 1.19615 5.48828 1.3231C5.27344 1.44029 5.17578 1.6649 5.23438 1.93834L5.47852 3.09068C5.07812 3.37389 4.66797 3.70592 4.30664 4.05748L3.22266 3.61803C2.97852 3.52037 2.75391 3.5692 2.56836 3.78404C2.40234 3.96959 2.38281 4.21373 2.51953 4.41881L3.1543 5.43443C2.87109 5.85435 2.62695 6.28404 2.40234 6.75279L1.21094 6.71373C0.957031 6.6942 0.742188 6.84068 0.654297 7.07506C0.576172 7.3192 0.654297 7.54381 0.849609 7.70006L1.78711 8.44225C1.66016 8.93053 1.5625 9.41881 1.5332 9.93639L0.390625 10.2977C0.136719 10.3856 0 10.5712 0 10.8348C0 11.0985 0.136719 11.284 0.390625 11.3622L1.5332 11.7235C1.5625 12.2508 1.66016 12.7489 1.78711 13.2274L0.849609 13.9696C0.654297 14.1161 0.585938 14.3504 0.654297 14.6044C0.742188 14.8387 0.957031 14.9852 1.21094 14.9657L2.40234 14.9071C2.62695 15.3758 2.87109 15.8251 3.1543 16.2254L2.51953 17.2411C2.38281 17.4657 2.40234 17.7098 2.56836 17.8954C2.75391 18.1102 2.97852 18.1688 3.22266 18.0614L4.30664 17.6122C4.66797 17.9735 5.07812 18.2958 5.47852 18.579L5.23438 19.7411C5.18555 20.0047 5.27344 20.2294 5.48828 20.3563C5.73242 20.4833 5.9668 20.454 6.15234 20.2782L7.03125 19.4872C7.5 19.6825 7.96875 19.868 8.45703 20.0047L8.63281 21.1864C8.66211 21.4403 8.83789 21.6258 9.08203 21.6747C9.3457 21.704 9.55078 21.5965 9.66797 21.3719L10.2344 20.3075C10.4883 20.327 10.7324 20.3465 10.9961 20.3465ZM10.9961 18.8719C6.52344 18.8719 3.06641 15.2977 3.06641 10.8446C3.06641 6.3817 6.52344 2.80748 10.9961 2.80748C15.4688 2.80748 18.9258 6.3817 18.9258 10.8446C18.9258 15.2977 15.4688 18.8719 10.9961 18.8719ZM9.28711 9.23326L10.3711 8.54967L7.06055 2.8856L5.9375 3.52037L9.28711 9.23326ZM13.2617 11.4598H19.8535L19.8438 10.2001H13.2617V11.4598ZM10.3809 13.1493L9.30664 12.4462L5.83984 18.12L6.95312 18.7743L10.3809 13.1493ZM10.9766 13.4129C12.3828 13.4129 13.5254 12.2704 13.5254 10.8544C13.5254 9.43834 12.3828 8.29576 10.9766 8.29576C9.56055 8.29576 8.41797 9.43834 8.41797 10.8544C8.41797 12.2704 9.56055 13.4129 10.9766 13.4129ZM10.9766 12.036C10.3027 12.036 9.79492 11.5184 9.79492 10.8544C9.79492 10.1903 10.3027 9.67271 10.9766 9.67271C11.6406 9.67271 12.1484 10.1903 12.1484 10.8544C12.1484 11.5184 11.6406 12.036 10.9766 12.036Z"
      fill="black"
      fillOpacity="0.85"
    />
  </svg>
  )
}

function AnalyticsIcon() {
  return(
    <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_565_696)">
      <path
        d="M1.07601 9.67369H2.61242C3.32631 9.67369 3.6936 9.33228 3.6936 8.65461V4.04019C3.6936 3.36252 3.32631 3.01592 2.61242 3.01592H1.07601C0.36729 3.01592 0 3.36252 0 4.04019V8.65461C0 9.33228 0.36729 9.67369 1.07601 9.67369ZM5.7266 9.67369H7.26821C7.98212 9.67369 8.34424 9.33228 8.34424 8.65461V2.53482C8.34424 1.85714 7.98212 1.51054 7.26821 1.51054H5.7266C5.01791 1.51054 4.65062 1.85714 4.65062 2.53482V8.65461C4.65062 9.33228 5.01791 9.67369 5.7266 9.67369ZM10.3772 9.67369H11.9188C12.6327 9.67369 13 9.33228 13 8.65461V1.02427C13 0.346598 12.6327 0 11.9188 0H10.3772C9.67369 0 9.30643 0.346598 9.30643 1.02427V8.65461C9.30643 9.33228 9.67369 9.67369 10.3772 9.67369Z"
        fill="black"
        fillOpacity="0.85"
      />
    </g>
    <defs>
      <clipPath id="clip0_565_696">
        <rect width="13" height="9.7513" fill="white" />
      </clipPath>
    </defs>
  </svg>
  )
}