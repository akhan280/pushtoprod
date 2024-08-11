"use client";

import { useSearchParams } from "next/navigation";
import useMainStore from "../../../../lib/hooks/use-main-store";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../components/ui/alert";
import { RocketIcon } from "lucide-react";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import { useEffect } from "react";

interface OnboardingLayoutProps {
  survey: React.ReactNode;
  portfolioSetup: React.ReactNode;
  getStarted: React.ReactNode;
  enableAI: React.ReactNode;
  complete: React.ReactNode;
}

export default function OnboardingLayout({
  survey,
  portfolioSetup,
  getStarted,
  enableAI,
  complete,
}: OnboardingLayoutProps) {
  const { onboardingStep, setOnboardingStep } = useMainStore();
  const searchParams = useSearchParams();
  const returning = searchParams.get("redirect");
  const checkout = searchParams.get("checkout");

  const tabs = [
    { id: 0, name: "Get Started", component: getStarted },
    { id: 1, name: "Survey", component: survey },
    { id: 2, name: "Enable AI", component: enableAI },
    { id: 3, name: "Portfolio Setup", component: portfolioSetup },
    { id: 4, name: "Complete", component: complete },
  ];

  useEffect(()=> {
    if (checkout) {
      setOnboardingStep(3)
    }
  },[])

  // If onboardingStep is 4, only show the complete component
  if (onboardingStep === 4) {
    return (
      <div className="flex min-h-full min-w-full flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          {tabs[onboardingStep]?.component}
        </div>
        <div>
          <div className="absolute left-0 top-0">
            <svg
              width="350"
              height="400"
              viewBox="0 0 350 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M247.351 4.76461C192.832 -102.249 90.5914 -159.429 18.9906 -122.951C-52.6103 -86.4732 -117.673 80.9868 -63.1543 188C-8.63529 295.013 144.821 301.056 216.422 264.578C288.022 228.1 301.87 111.778 247.351 4.76461Z"
                fill="url(#paint0_radial_438_1470)"
                fill-opacity="0.5"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_438_1470"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(107.699 101.713) rotate(141.665) scale(164.909 92.1485)"
                >
                  <stop stop-color="#FEBC2E" />
                  <stop offset="1" stop-color="#FEBC2E" stop-opacity="0.05" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute left-1/2 top-0 mt-4 flex -translate-x-1/2 transform flex-col items-center">
        <Image src={logo} width={80} height={80} alt="logo" draggable="false" />
        {returning && (
          <Alert className="mt-4 max-w-lg">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Welcome back!</AlertTitle>
            <AlertDescription>Let's get you set up</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="absolute left-0 top-0">

      <svg
              width="350"
              height="400"
              viewBox="0 0 350 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M247.351 4.76461C192.832 -102.249 90.5914 -159.429 18.9906 -122.951C-52.6103 -86.4732 -117.673 80.9868 -63.1543 188C-8.63529 295.013 144.821 301.056 216.422 264.578C288.022 228.1 301.87 111.778 247.351 4.76461Z"
                fill="url(#paint0_radial_438_1470)"
                fill-opacity="0.5"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_438_1470"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(107.699 101.713) rotate(141.665) scale(164.909 92.1485)"
                >
                  <stop stop-color="#FEBC2E" />
                  <stop offset="1" stop-color="#FEBC2E" stop-opacity="0.05" />
                </radialGradient>
              </defs>
            </svg>
            </div>

      <div className="flex min-h-full min-w-full flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          {tabs[onboardingStep]?.component}
        </div>
      </div>
    </>
  );
}
