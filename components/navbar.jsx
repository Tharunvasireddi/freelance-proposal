import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { logo } from "../public/logo.png";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-sm font-semibold text-white shadow-lg shadow-white/5">
            FA
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-white sm:text-base">
              Freelance App
            </span>
            <span className="hidden text-xs text-zinc-500 sm:block">
              AI proposal workspace
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="hidden border-white/15 bg-white/5 text-white hover:bg-white/10 sm:inline-flex"
          >
            <Link href="/dashboard">
              <LayoutDashboard />
              Dashboard
            </Link>
          </Button>
          <Button asChild className="bg-white text-black hover:bg-zinc-200">
            <Link href="/signin">
              Sign In
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
