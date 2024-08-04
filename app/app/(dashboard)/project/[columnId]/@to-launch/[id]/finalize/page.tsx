
"use client"

import StepperDemo from "@/components/stepper-demo"
import StepperClickableSteps from "@/components/stepper-clickable-steps"
import { Button } from "@/components/ui/button"

import { useRouter, usePathname } from 'next/navigation'  // Import the useRouter hook

export default function FinalizeLaunchRenderer({ params }: { params: {id: string} }) {
    console.log('[Path rending]', params)
    const router = useRouter()
    const pathname = usePathname()

 

    return (
        <div>
            <StepperClickableSteps></StepperClickableSteps>
            <StepperDemo></StepperDemo>

        
        
        </div>
    )
}
