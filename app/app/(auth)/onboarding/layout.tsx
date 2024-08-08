"use client"

import { useState } from "react";

interface OnboardingLayoutProps {
  survey: React.ReactNode;
  portfolioSetup: React.ReactNode;
  getStarted: React.ReactNode;
  enableAI: React.ReactNode;
}

export default function OnboardingLayout({ survey, portfolioSetup, getStarted, enableAI }: OnboardingLayoutProps) {
    const [tab, setTab] = useState(0);

  const tabs = [
    { id: 0, name: "Survey", component: survey },
    { id: 1, name: "Portfolio Setup", component: portfolioSetup },
    { id: 2, name: "Get Started", component: getStarted },
    { id: 3, name: "Enable AI", component: enableAI },
  ];

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mb-4 flex justify-center space-x-4">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`px-4 py-2 rounded ${
              tab === tabItem.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {tabItem.name}
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        {tabs[tab]?.component}
      </div>
    </div>
  );
};


