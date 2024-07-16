import Navigation from "@/components/navigation";
import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Company | Campaigns",
};
const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default layout;
