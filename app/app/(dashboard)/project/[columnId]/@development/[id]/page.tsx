
"use client"

import ColumnRender from "../../column-render"

export default function DevelopmentRenderer({ params }: { params: {id: string} }) {
    console.log('[Path rending]', params)
    return (
        <>
        <div>rendered</div>
        <ColumnRender columnId={params.id}/>
        </>
    )
}