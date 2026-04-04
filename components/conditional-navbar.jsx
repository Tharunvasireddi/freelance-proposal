"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/signin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  return <Navbar />;
}
