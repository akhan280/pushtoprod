"use client";

import { useState } from "react";
import useMainStore from "../../../../lib/hooks/use-main-store";
import { redirect, useSearchParams } from "next/navigation";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../components/ui/alert";
import { RocketIcon } from "lucide-react";
import Image from "next/image";
import logo from "../../../../public/logo.png"

interface OnboardingLayoutProps {
  survey: React.ReactNode;
  portfolioSetup: React.ReactNode;
  getStarted: React.ReactNode;
  enableAI: React.ReactNode;
}

export default function OnboardingLayout({
  survey,
  portfolioSetup,
  getStarted,
  enableAI,
}: OnboardingLayoutProps) {
  const { onboardingStep, setOnboardingStep } = useMainStore();
  const searchParams = useSearchParams();
  const returning = searchParams.get("redirect");

  const tabs = [
    { id: 0, name: "Get Started", component: getStarted },
    { id: 1, name: "Survey", component: survey },
    { id: 2, name: "Enable AI", component: enableAI },
    { id: 3, name: "Portfolio Setup", component: portfolioSetup },
  ];

  return (
    <>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 flex flex-col items-center">
        <Image src={logo} width={80} height={80} alt="logo" draggable="false" />
        {returning && (
          <Alert className="max-w-lg mt-4">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Welcome back!</AlertTitle>
            <AlertDescription>
              Let's get you set up
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex min-h-full min-w-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          {tabs[onboardingStep]?.component}
        </div>
      </div>
    </>
  );
}
