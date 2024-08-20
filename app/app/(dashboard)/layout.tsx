import { ReactNode, Suspense } from "react";
import { TooltipProvider } from "../../../components/ui/tooltip";
import NavigationComponent from "../../../components/nav-bar";
import AddProjectDialog from "../../../components/dialog/add-project-dialog";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="min-h-screen dark:bg-black">
        <TooltipProvider>
        {children}
        <NavigationComponent></NavigationComponent>
        <AddProjectDialog></AddProjectDialog>

        </TooltipProvider>
      </div>
    </div>
  );
}
