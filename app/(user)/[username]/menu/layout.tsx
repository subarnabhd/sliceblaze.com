
import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Menu",
  description: "View the menu for this user.",
};

export default function MenuLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
