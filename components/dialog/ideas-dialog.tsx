
"use client";
import useMainStore from "../../lib/hooks/use-main-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "../ui/sheet";
import Header from "../projects/header";

type IdeasDialogProps = {
  dummyPost: any;
};

import { PlateEditor } from "../projects/plate-editor";

export function IdeasDialog({ dummyPost }: IdeasDialogProps) {
  const { dialog, showDialog, requestedAdd, dragged, selectedProject } = useMainStore();

  return (
    <div>
      <Sheet open={dialog} onOpenChange={showDialog}>
        <SheetContent className="bg-white sm:max-w-[800px]" route ={selectedProject?.id!}>
          <SheetHeader>
            <Header partial={true}></Header>
          </SheetHeader>
            <PlateEditor></PlateEditor>
        </SheetContent>
      </Sheet>
    </div>
  );
}
