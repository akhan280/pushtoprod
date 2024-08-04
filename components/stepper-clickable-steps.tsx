"use client";

import { Step, type StepItem, Stepper, useStepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";

const steps = [
	{ label: "Step 1" },
	{ label: "Step 2" },
	{ label: "Step 3" },
] satisfies StepItem[];



export default function StepperClickableSteps() {
    const router = useRouter();
    // const 

	return (
		<div className="flex w-full flex-col gap-4">
			<Stepper
				initialStep={0}
				steps={steps}
				onClickStep={(step, setStep) => {
                    if (step === 1){
                        router.push('/tofinalize')

                    }
					
					setStep(step);
				}}
			>
			
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