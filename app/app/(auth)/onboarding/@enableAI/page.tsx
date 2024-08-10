"use client"
import {
  ManagedAI,
  SelfHostedAI,
} from "../../../../../components/ai-query-options";
import { Button } from "../../../../../components/ui/button";
import useMainStore from "../../../../../lib/hooks/use-main-store";

export default function EnableAI() {
    const {setOnboardingStep} = useMainStore();

    return (
        <div className="flex flex-col items-center gap-32">
            <div className="flex flex-col items-center">
                <div>Enable AI Features?</div>
                <div className="max-w-md text-center">
                We are committed to a one-time payment for lifetime use. However, GPT
                costs are usage-based. To generate copy for your launches, we require
                your API key stored on your client. We also offer an optional instance
                management service for a small fee, regardless of usage.
                </div>
            </div>

            <div className="flex flex-row gap-8">
                <SelfHostedAI></SelfHostedAI>
                <div>or</div>
                <ManagedAI></ManagedAI>
            </div>

            <Button onClick={() => {setOnboardingStep(3)}}>i don’t want AI features</Button>
        </div>
  );
}
