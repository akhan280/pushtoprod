
"use server";
// import Sidebar from "@/components/projects/sidebar";
// import { PlateEditor } from "@/components/projects/plate-editor";
// import ColumnRender from "./column-render";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import React from 'react';
import StepperClickableSteps from '../../../../../../../components/projects/launch/stepper/stepper-clickable-steps';
// import ReactDOM from 'react-dom';
// import StepperClickableSteps from '../../../../../../../components/projects/launch/stepper/stepper-clickable-steps';


export default async function ToLaunchLayout({
  deploy,
  finalize,
  market,
}: {
  deploy: React.ReactNode;
  finalize: React.ReactNode;
  market: React.ReactNode;
}) {


  return (
    <div className="flex flex-col">
        <StepperClickableSteps deploy = {deploy} finalize = {finalize} market = {market}/>
    </div>
  );
}
