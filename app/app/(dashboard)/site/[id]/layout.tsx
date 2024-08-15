import { ReactNode } from "react";
import Nav from "../../../../../components/nav-bar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-screen-full flex-col ">
      <div className="flex flex-col">{children}</div>
      <div><Nav site={true}/> </div>

    </div>
  );
}
