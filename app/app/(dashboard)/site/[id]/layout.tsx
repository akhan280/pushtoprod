import { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-screen-full flex-col ">
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
