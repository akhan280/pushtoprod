"use client";

import { ModalProvider } from "@/components/modal/provider";
import { Toaster } from "../components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ModalProvider>{children}</ModalProvider>
      <Toaster />
    </>
  );
}