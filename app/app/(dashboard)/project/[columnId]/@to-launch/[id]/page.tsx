
"use client"

import { Button } from "@/components/ui/button"
import ColumnRender from "../../column-render"
import { useRouter, usePathname } from 'next/navigation'  // Import the useRouter hook

export default function LaunchRenderer({ params }: { params: {id: string} }) {
    console.log('[Path rending]', params)
    const router = useRouter()
    const pathname = usePathname()

    const handleClick = () => {
        router.push(`${pathname}/finalize`)
    }


    return (
        <div>

        <Button onClick = {handleClick}> Take Me to Launch</Button>
        <ColumnRender columnId={params.id}/>
        </div>
    )
}

