'use client'

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Homebanner from "@/components/Homebanner";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Header />
      <Homebanner />
      <Footer />
    </div>
  );
}

