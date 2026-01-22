"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function OwnerLogin() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified login page
    router.push("/login");
  }, [router]);

  return null;
}
