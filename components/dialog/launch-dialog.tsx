
"use client";
import { useEffect } from "react";
import useMainStore from "../../lib/hooks/use-main-store";
import Editor from "../editor";
import { useRouter } from "next/navigation"; 
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
import Header from "./header";

type IdeasDialogProps = {
  dummyPost: any;
};

export function LaunchDialog({ dummyPost }: IdeasDialogProps) {
  const { dialog, showDialog, requestedAdd, dragged, selectedProject } = useMainStore();

  useEffect(() => {
    console.log('[ideas] Effect Triggered');
    console.log('[ideas] Selected Project:', selectedProject);
    console.log('[ideas] Requested Add:', requestedAdd);
    console.log('[ideas] Dialog Open:', dialog);
    console.log('[ideas] Dragged State:', dragged);
    
  }, [selectedProject, requestedAdd, dialog, dragged]);

  return (
    <div>
      {requestedAdd ? (
        <Dialog open={dialog} onOpenChange={showDialog}>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <Header />
          <DialogHeader>
            <DialogTitle>We are launching</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
     
      ) : (
        <Sheet open={dialog} onOpenChange={showDialog}>
        <SheetContent className="bg-white sm:max-w-[800px]" route ={selectedProject?.id!}>
          <Header />
          <SheetHeader>
            <SheetTitle>We are launching</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
          {!dragged && <Editor post={dummyPost} />}

        </SheetContent>
      </Sheet>
      )}
    </div>
  );
}
