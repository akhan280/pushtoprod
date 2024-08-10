import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import { TooltipProvider } from "../../../components/ui/tooltip";
import Navbar from "../../../components/nav-bar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <TooltipProvider>

      <div className="min-h-screen dark:bg-black">{children}</div>
      <div><Navbar></Navbar></div>

      </TooltipProvider>
    </div>
  );
}
