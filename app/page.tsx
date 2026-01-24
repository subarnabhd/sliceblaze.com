'use client'

import Homebanner from "@/components/Homebanner";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Homebanner />
    </div>
  );
}

