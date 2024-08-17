import React, { useState } from "react";
import { Input } from "../ui/input";
import { AutosizeTextarea } from "../ui/textarea";
import useMainStore from "../../lib/hooks/use-main-store";

export default function Header({
  partial,
  children,
}: {
  partial: boolean;
  children?: React.ReactNode; // Make children optional
}) {
  const [loading, setLoading] = useState(false);
  const {
    selectedProject,
    setProjectProperty,
  } = useMainStore();

  return partial ? (
    <div className="">
      <Input
        value={selectedProject?.title || ""}
        placeholder="Title"
        onChange={(e) => setProjectProperty("title", e.target.value)}
        className="text-bold border-0 bg-transparent py-8 text-[40px] outline-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
      />

      <AutosizeTextarea
        placeholder="Description"
        wrap="hard"
        className="text-bold text-md resize-y overflow-auto border-0 bg-transparent outline-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
        value={selectedProject?.description || ""}
        onChange={(e) => setProjectProperty("description", e.target.value)}
        rows={1}
      />

      <AutosizeTextarea
        placeholder="GitHub URL"
        className="text-bold text-md border-0 bg-transparent py-8 outline-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
        value={selectedProject?.githuburl || ""}
        onChange={(e) => setProjectProperty("githuburl", e.target.value)}
      />
    </div>
  ) : (
    
    <div className="pt-8 px-6 bg-white rounded-lg shadow-sm">
      <div className="mb-4">
        <Input
          value={selectedProject?.title || ""}
          placeholder="Title"
          onChange={(e) => setProjectProperty("title", e.target.value)}
          className="w-full border-0 bg-transparent py-2 text-4xl font-bold text-black outline-none focus:ring-0"
        />
      </div>

      <div className="flex flex-row items-start">
        <AutosizeTextarea
          placeholder="Description"
          className="text-md w-full border-0 bg-transparent text-gray-700 outline-none focus:ring-0"
          value={selectedProject?.description || ""}
          onChange={(e) => setProjectProperty("description", e.target.value)}
          rows={4}
        />
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}