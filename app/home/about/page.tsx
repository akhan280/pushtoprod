import { Suspense } from "react";
import Sites from "@/components/sites";
import OverviewStats from "@/components/overview-stats";
import Posts from "@/components/posts";
import Link from "next/link";
import PlaceholderCard from "@/components/placeholder-card";
import OverviewSitesCTA from "@/components/overview-sites-cta";

export default function Overview() {
  return (
    <div className="flex max-w-screen flex-col min-h-screen">
      {/* SVG Filter Definition */}
      <svg className="hidden">
        <filter id="grainy">
          <feTurbulence type="turbulence" baseFrequency="0.5"></feTurbulence>
          <feColorMatrix type="saturate" values="0"></feColorMatrix>
          <feBlend mode="multiply" in2="SourceGraphic" />
        </filter>
      </svg>

      {/* Grainy Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ opacity: 0.18 }}>
        <div className="w-full h-full" style={{ filter: 'url(#grainy)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      </div>

      <div className="flex flex-col space-y-6 z-10 items-center">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          areeb and ani are goated
        </h1>
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          YEET
        </h1>

        <h1 className="font-cal text-3xl font-bold dark:text-white">
          YEET
        </h1>

      </div>

    </div>
  );
}
