"use client"
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./logout-button";
import useMainStore from "../lib/hooks/use-main-store";
import { useEffect, useState } from "react";

export default async function Profile() {
  const [id, setId] = useState('')
  const {user} = useMainStore();

  useEffect(() => {
    console.log('User', user)
    setId(user?.site.id)
  },[user])

  return (
    <div className="flex flex-row ml-auto">
      <Link
        href="/settings"
        className="flex w-full flex-1 items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
      >
        <Image
          src="https://illustrations.popsy.co/gray/timed-out-error.svg"
          width={40}
          height={40}
          alt={user?.email ?? "User avatar"}
          className="h-6 w-6 rounded-full"
        />
        <Link href={`/site/${id}`}>
          <span className="truncate text-sm font-medium">
            Your Portfolio
          </span>
        </Link>
    
      </Link>
      <LogoutButton />
    </div>
  );
}
