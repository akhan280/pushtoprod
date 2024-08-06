
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
  start,
  deploy,
  finalize,
  market,
}: {
  start: React.ReactNode
  deploy: React.ReactNode;
  finalize: React.ReactNode;
  market: React.ReactNode;
}) {


  return (
    <div> {/* Center content vertically and horizontally */}
        <StepperClickableSteps start = {start} deploy={deploy} finalize={finalize} market={market} />
    </div>

  );
}
