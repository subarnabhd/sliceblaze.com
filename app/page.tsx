'use client'

import Categorycount from "@/components/Categorycount";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Homebanner from "@/components/Homebanner";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Use router if needed (placeholder to avoid unused warning)
  const handleNavigation = (path: string) => router.push(path);

  return (
    <div>
      <Header />
      <Homebanner />
      <Categorycount />
      <Features />

      <Footer />
    </div>
  );
}

