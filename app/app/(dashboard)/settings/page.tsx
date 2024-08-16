"use client";
import useMainStore from "../../../../lib/hooks/use-main-store";
import { User } from "@prisma/client";
import { Input } from "../../../../components/ui/input";
import { useState } from "react";
import { ButtonLoading } from "../../../../components/ui/loading-ui/button-loading";

export default function SettingsPage() {
  const { user, setUserProperty } = useMainStore();
  const [loading, setLoading] = useState(false);

  const editUser = async (key: keyof User, value: string) => {
    setLoading(true)
    try {
      const userId = user.id; // Assuming `user.id` exists
      const result = await setUserProperty(key, value, userId);
      if (result === "success") {
        console.log(`${key} updated successfully`);
      }
    } catch (error) {
      console.error("Failed to update user property:", error);
    }
    setLoading(false)
  };

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Settings
        </h1>
        
        {loading && 
        <div>
          <ButtonLoading></ButtonLoading>
        </div>
        }

        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name!}
            placeholder="Your Name"
            maxLength={32}
            onBlur={(e) => editUser("name", e.target.value)}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please use 32 characters maximum.
          </p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email!}
            placeholder="youremail@gmail.com"
            onBlur={(e) => editUser("email", e.target.value)}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please enter a valid email.
          </p>
        </div>
      </div>
    </div>
  );
}