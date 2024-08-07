
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
  // showDialog(true)

  // useEffect(() => {
  //   console.log('[ideas] Effect Triggered');
  //   console.log('[ideas] Selected Project:', selectedProject);
  //   console.log('[ideas] Requested Add:', requestedAdd);
  //   console.log('[ideas] Dialog Open:', dialog);
  //   console.log('[ideas] Dragged State:', dragged);

  return (
    <div>
      <Sheet open={dialog} onOpenChange={showDialog}>
        <SheetContent className="bg-white sm:max-w-[800px]" route ={selectedProject?.id!}>
          <SheetHeader>
            <Header partial={true}></Header>
          </SheetHeader>
          {/* {!dragged && <Editor post={dummyPost} />} */}
            <PlateEditor></PlateEditor>
        </SheetContent>
      </Sheet>
    </div>
  );
}
