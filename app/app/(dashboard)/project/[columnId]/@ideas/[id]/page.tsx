
"use client"
import ColumnRender from "../../column-render";


export default function IdeasRenderer({ params }: { params: {id: string} }) {
    return (
        <div className="flex flex-col justify-center items-center place-items-center">
        <ColumnRender columnId={params.id}/>
      </div>
    );
}
