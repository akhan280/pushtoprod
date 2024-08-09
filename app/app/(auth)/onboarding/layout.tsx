"use client"

import { useState } from "react";
import useMainStore from "../../../../lib/hooks/use-main-store";

interface OnboardingLayoutProps {
  survey: React.ReactNode;
  portfolioSetup: React.ReactNode;
  getStarted: React.ReactNode;
  enableAI: React.ReactNode;
}

export default function OnboardingLayout({ survey, portfolioSetup, getStarted, enableAI }: OnboardingLayoutProps) {
  const {onboardingStep, setOnboardingStep} = useMainStore();

  const tabs = [
    { id: 0, name: "Get Started", component: getStarted },
    { id: 1, name: "Survey", component: survey },
    { id: 2, name: "Enable AI", component: enableAI },
    { id: 3, name: "Portfolio Setup", component: portfolioSetup },
  ];

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mb-4 flex justify-center space-x-4">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setOnboardingStep(tabItem.id)}
            className={`px-4 py-2 rounded ${
              onboardingStep === tabItem.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {tabItem.name}
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        {tabs[onboardingStep]?.component}
      </div>
    </div>
  );
};


