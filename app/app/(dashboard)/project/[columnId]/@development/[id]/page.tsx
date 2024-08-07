
"use client"

import DevelopmentRender from "./renderer"
export default function Development({ params }: { params: {id: string} }) {
    console.log('[Path rending]', params)

    if (params.id === "new") {
        return (
        <>
        hi
        </>
        )
    }
    return (
        <>
          <DevelopmentRender></DevelopmentRender>
        </>
    )
}