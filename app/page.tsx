'use client'

import Categorycount from "@/components/Categorycount";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HBanner from "@/components/HBanner";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();


  return (
    <div>
      <Header />
      <HBanner />
      <Categorycount />
      <Features />
      <Footer />
    </div>
  );
}

