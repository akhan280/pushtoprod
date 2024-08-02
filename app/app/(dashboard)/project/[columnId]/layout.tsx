"use server"
import ColumnRender from "./column-render";


export default async function ProjectLayout({ ideas, development, toLaunch, params }: { ideas: React.ReactNode, development: React.ReactNode, toLaunch: React.ReactNode, params: { columnId: string }  }) {
  const { columnId } = params; 

  if (!columnId) {
    throw ('No column found')
  }

  console.log('Rendering the ProjectLayout')

  return (
    <div className="flex flex-col justify-center items-center place-items-center">
      {columnId === "ideas" && ideas}
      {columnId === "development" && development}
      {columnId === "toLaunch" && toLaunch}
    </div>
    );
}