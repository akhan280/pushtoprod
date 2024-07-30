import { Suspense } from "react";
import Sites from "@/components/sites";
import OverviewStats from "@/components/overview-stats";
import Posts from "@/components/posts";
import Link from "next/link";
import PlaceholderCard from "@/components/placeholder-card";
import OverviewSitesCTA from "@/components/overview-sites-cta";
import { KanbanBoard } from "../../../components/kanban/kanban";

export default function Overview() {
  return (
    <div className="flex flex-col">
    

      <div className="flex flex-col pt-32">

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <KanbanBoard></KanbanBoard>
        </Suspense>
      </div>

      
    </div>
  );
}
