import type { Metadata } from "next";
import { ReactNode } from "react";
import { metadata } from "./metadata";

export const generateMetadata = async (): Promise<Metadata> => {
  return metadata;
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
