import { ReactNode, Suspense } from "react";
import { TooltipProvider } from "../../../components/ui/tooltip";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="min-h-screen dark:bg-black">
        <TooltipProvider>
        {children}
        </TooltipProvider>
      </div>
    </div>
  );
}
