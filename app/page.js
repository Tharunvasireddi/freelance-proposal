"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { features } from "@/lib/constants";

const featureIcons = {
  FileText,
  BadgeCheck,
  Sparkles,
  Wand2,
};

const trustPoints = [
  "Generate structured proposals in seconds",
  "Edit before saving to the database",
  "Keep your brand tone consistent across every project",
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_24%)]" />
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-104 h-72 w-72 rounded-full bg-zinc-400/10 blur-3xl" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <div className="max-w-3xl space-y-8">
            <Badge className="rounded-full border-white/20 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white">
              AI Freelancer Proposal Generator
            </Badge>

            <div className="space-y-5">
              <h1 className="max-w-2xl text-balance font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Turn client requirements into proposals that feel sharp,
                personal, and ready to send.
              </h1>
              <p className="max-w-2xl text-pretty text-sm leading-7 text-zinc-300 sm:text-base lg:text-lg">
                The workflow is built for freelancers who want speed without
                losing control. Generate scope, timeline, pricing, and contract
                sections. Review the response, edit it when needed, and only
                then save it to your project history.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-11 bg-white px-5 text-black hover:bg-zinc-200"
              >
                <Link href="/signin">
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 border-white/20 bg-white/5 px-5 text-white hover:bg-white/10"
              >
                <Link href="/dashboard">Open Dashboard</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <p className="text-sm leading-6 text-zinc-200">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-white/15 via-white/5 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-white/5 backdrop-blur-xl sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    Live workflow
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    Proposal generation flow
                  </h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                  Ready
                </div>
              </div>

              <div className="grid gap-3">
                {[
                  [
                    "1. Paste requirement",
                    "Provide project details in plain language.",
                  ],
                  [
                    "2. Review AI output",
                    "Adjust scope, timeline, pricing, or contract clauses.",
                  ],
                  [
                    "3. Save to dashboard",
                    "Store only what you approve and reuse later.",
                  ],
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
          </div>
        </section>

        <section className="pb-10 pt-4 lg:pb-16">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Everything you need to win better projects
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-300 sm:text-base">
                A focused feature set that keeps the UI calm, responsive, and
                easy to trust while you work.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = featureIcons[feature.icon] || FileText;

              return (
                <Card
                  key={feature.id}
                  className="group border border-white/10 bg-zinc-950/70 text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-zinc-900/90 hover:shadow-2xl hover:shadow-white/10"
                >
                  <CardHeader className="gap-4 px-5 pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 transition group-hover:bg-white/15">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs text-zinc-500">
                        0{index + 1}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-white">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-6 text-zinc-300">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
