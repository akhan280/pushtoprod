import { ReactNode } from "react";
import NavigationComponent from "../../../../../components/nav-bar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-screen-full flex-col ">
      <div className="flex flex-col">{children}</div>
      <div><NavigationComponent site={true}/> </div>
    </div>
  );
}
