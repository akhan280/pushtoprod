
"use client";
import { useEffect } from "react";
import useMainStore from "../../lib/hooks/use-main-store";
import Editor from "../editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import Header from "../projects/header";

type IdeasDialogProps = {
  dummyPost: any;
};

import { PlateEditor } from "../projects/plate-editor";

export function IdeasDialog({ dummyPost }: IdeasDialogProps) {
  const { dialog, showDialog, requestedAdd, dragged, selectedProject } = useMainStore();
  // showDialog(true)

  // useEffect(() => {
  //   console.log('[ideas] Effect Triggered');
  //   console.log('[ideas] Selected Project:', selectedProject);
  //   console.log('[ideas] Requested Add:', requestedAdd);
  //   console.log('[ideas] Dialog Open:', dialog);
  //   console.log('[ideas] Dragged State:', dragged);
  // }, [selectedProject, requestedAdd, dialog, dragged]);

  return (
    <div>
      <Sheet open={dialog} onOpenChange={showDialog}>
        <SheetContent className="bg-white sm:max-w-[800px]" route ={selectedProject?.id!}>
          {/* <Header /> */}
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
          {/* {!dragged && <Editor post={dummyPost} />} */}
          <PlateEditor></PlateEditor>
        </SheetContent>
      </Sheet>
    </div>
  );
}
