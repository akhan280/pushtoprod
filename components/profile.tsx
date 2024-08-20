
import Link from "next/link";

import { User } from "../lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/plate-ui/avatar";


interface ProfileProps {
  fetchedUser: User;
}

export default function Profile({fetchedUser}: ProfileProps) {

  return (
    <div className="flex flex-row ml-auto">
      <div
        className="flex w-full flex-1 items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
      >
         <Avatar>
            <AvatarImage width={30} height={30} src={fetchedUser.image ?? ''} alt={fetchedUser.name ?? 'User'} />
            <AvatarFallback className="w-8 h-8">{fetchedUser.name?.[0] || 'AA'}</AvatarFallback>
          </Avatar>
          
          <div className="truncate text-sm font-medium">
            Your Portfolio
          </div>
      </div>
    </div>
  );
}
