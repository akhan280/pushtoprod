
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./logout-button";
import { User } from "../lib/types";


interface ProfileProps {
  fetchedUser: User;
}

export default async function Profile({fetchedUser}: ProfileProps) {

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
          alt={fetchedUser?.email ?? "User avatar"}
          className="h-6 w-6 rounded-full"
        />
        <Link href={`/site/${fetchedUser.siteId}`}>
          <span className="truncate text-sm font-medium">
            Your Portfolio
          </span>
        </Link>
    
      </Link>
      <LogoutButton />
    </div>
  );
}
