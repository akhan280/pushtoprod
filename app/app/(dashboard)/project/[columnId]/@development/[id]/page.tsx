
"use client"

import { createProject } from "../../../../../../../lib/actions"
import ColumnRender from "../../column-render"

export default function DevelopmentRenderer({ params }: { params: {id: string} }) {
    console.log('[Path rending]', params)

    if (params.id === "new") {
        return (
        <>
        hi
        </>)
    }

    return (
        <>
        <div>j</div>
        <ColumnRender columnId={params.id}/>
        </>
    )
}