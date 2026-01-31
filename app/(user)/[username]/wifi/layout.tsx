import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User WiFi",
  description: "View the WiFi information for this user.",
};

export default function WifiLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
