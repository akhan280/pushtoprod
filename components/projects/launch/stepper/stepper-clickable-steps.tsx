"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../../ui/button";
import { StepItem } from "./types";
import { Step, Stepper, useStepper } from ".";
import useMainStore from "../../../../lib/hooks/use-main-store";

const steps = [
  { label: "Start" },
  { label: "Finalize" },
  { label: "Deploy" },
  { label: "Market" },
] satisfies StepItem[];

export default function StepperClickableSteps({
  start,
  deploy,
  finalize,
  market,
}: {
  start: React.ReactNode;
  deploy: React.ReactNode;
  finalize: React.ReactNode;
  market: React.ReactNode;
}) {
  const { step, setLaunchStep, } = useMainStore();
  const [currentStepContent, setCurrentStepContent] =
    useState<React.ReactNode>(null);

  useEffect(() => {  console.log('step', step)  }, [step])

  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper
        initialStep={step}
        steps={steps}
        onClickStep={(step, setStep) => {
          setStep(step);
          setLaunchStep(step);
        }}
      >
        <Step label={steps[0].label}>
          {start}
        </Step>

        <Step key={1} label={steps[0].label}>
          {deploy}
        </Step>

        <Step key={2} label={steps[2].label}>
          {deploy}
        </Step>

        <Step key={3} label={steps[3].label}>
          {market}
        </Step>

        <Footer />
      </Stepper>
    </div>
  );
}

const Footer = () => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
    activeStep
  } = useStepper();

  if (activeStep === 0) {
    return(<div></div>)
  }

  return (
    <>
      {hasCompletedAllSteps && (
        <div className="my-2 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="flex w-full justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  );
};
