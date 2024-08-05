"use client"

import React from "react"
import { Button } from "@/components/ui/button"

export default function FinalizeDeployRenderer() {
    return (
        <div className="container mx-auto p-4">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-lg bg-gradient-to-br from-green-400 to-white opacity-40 transform -translate-x-1/2 -translate-y-2/3"></div>
            
            <div className="flex h-[80vh] items-center justify-start gap-x-40">
                <div className="w-1/2">
                    <h1 className="text-2xl font-bold text-tremor-content-strong">
                        It’s time to launch your project
                    </h1>
                    <p className="mt-2 text-tremor-content">
                        Confirm your project details, add it to your portfolio, and generate copy & creatives to market on all major platforms.
                    </p>
                    <div className="flex items-center mt-4">
                    <Button>
                        Start 
                    </Button>
                    <span className="ml-2 text-xs text-tremor-content-muted">Takes about 5 minutes</span>
                    </div>
                </div>

                
            </div>
        </div>
    )
}
