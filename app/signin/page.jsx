import LoginForm from "./_components/LoginForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/session";

export default async function SignIn() {
  const session = await getServerSession();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-black px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_24%)]" />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-4 h-72 w-72 rounded-full bg-zinc-300/10 blur-3xl" />

      <Link
        href="/"
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-7xl items-start gap-8 pt-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12 lg:pt-0">
        <div className="order-2 space-y-6 pt-2 text-white sm:pt-4 lg:order-1 lg:pt-0">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-zinc-300 ">
            Secure access
          </div>
          <h1 className="max-w-xl text-balance font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
            Build winning proposals faster, with less effort.
          </h1>
          <p className="max-w-xl text-sm leading-7 text-zinc-300 md:text-base lg:text-lg">
            Sign in to generate scope, pricing, and legal-ready agreements in
            seconds. The dashboard keeps your saved work organized and easy to
            revisit when clients reply.
          </p>

          <div className="hidden gap-3 sm:grid-cols-3 lg:grid">
            {[
              ["Fast start", "Login and create in one flow"],
              ["Safe session", "Keep your proposal history private"],
              ["Responsive UI", "Works smoothly on mobile and desktop"],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-300">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-white/10 via-white/5 to-transparent blur-2xl" />
          <div className="relative">
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
