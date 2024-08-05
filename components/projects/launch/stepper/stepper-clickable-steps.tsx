"use client";

import React, { useState } from "react";
import { Button } from "../../../ui/button";
import { StepItem } from "./types";
import { Step, Stepper, useStepper } from ".";
import useMainStore from "../../../../lib/hooks/use-main-store";

const steps = [
	{ label: "Step 1" },
	{ label: "Step 2" },
	{ label: "Step 3" },
] satisfies StepItem[];

export default function StepperClickableSteps({
	deploy,
	finalize,
	market,
}: {
	deploy: React.ReactNode;
	finalize: React.ReactNode;
	market: React.ReactNode;
}) {

	const { step, setLaunchStep } = useMainStore();
	const [currentStepContent, setCurrentStepContent] = useState<React.ReactNode>(null);

	return (
		<div className="flex flex-col gap-4"> {/* Full width container */}
			<div className="w-full mx-auto"> {/* Center and constrain the width of the Stepper */}
				<Stepper
					initialStep={0}
					steps={steps}
					onClickStep={(step, setStep) => {
						setStep(step);
						setLaunchStep(step);
					}}
				>
					<Step key={0} label={steps[0].label}>
						{deploy}
					</Step>

					<Step key={1} label={steps[1].label}>
						{finalize}
					</Step>

					<Step key={2} label={steps[2].label}>
						{market}
					</Step>

					<Footer />
				</Stepper>
			</div>
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
	} = useStepper();

	return (
		<>
			{hasCompletedAllSteps && (
				<div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
					<h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
				</div>
			)}
			<div className="w-full flex justify-end gap-2">
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
