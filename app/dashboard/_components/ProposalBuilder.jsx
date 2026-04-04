"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  PencilLine,
  Save,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const textareaClassName =
  "min-h-24 max-h-96 w-full resize-y rounded-md border border-white/15 bg-white/5 p-3 text-sm text-white placeholder:text-zinc-400 focus:border-white/40 focus:outline-none";

const emptyGenerated = {
  scope: "",
  timeline: "",
  pricing: "",
  contract: "",
};

export default function ProposalBuilder({ user }) {
  const router = useRouter();
  const [originalInput, setOriginalInput] = useState("");
  const [generated, setGenerated] = useState(emptyGenerated);
  const [status, setStatus] = useState("draft");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleGenerate = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!originalInput.trim()) {
      setMessage({ type: "error", text: "Please enter project details." });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalInput }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to generate proposal");
      }

      setGenerated(payload.generated || emptyGenerated);
      setIsGenerated(true);
      setIsEditable(false);
      setMessage({
        type: "success",
        text: "Proposal generated. Review it, then save to your projects.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    setMessage(null);

    if (
      !originalInput.trim() ||
      !generated.scope.trim() ||
      !generated.timeline.trim() ||
      !generated.pricing.trim() ||
      !generated.contract.trim()
    ) {
      setMessage({
        type: "error",
        text: "Please complete all generated sections before saving.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "manual",
          originalInput,
          status,
          generated,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to save project");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              New Project
            </p>
            <h1 className="text-2xl font-semibold md:text-4xl">
              Generate proposal for {user?.name || user?.email || "Freelancer"}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
              Paste the client requirement, generate an AI draft, review the
              response, make changes if needed, then save it into your project
              history.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <Link href="/dashboard">
              <ArrowLeft />
              Back to Dashboard
            </Link>
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="border-white/15 bg-zinc-950/70 text-white backdrop-blur">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-3" onSubmit={handleGenerate}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-zinc-300">
                  Give the system enough context to infer scope, timeline,
                  pricing, and contract language. The more concrete the brief,
                  the better the output.
                </div>

                <textarea
                  className={`${textareaClassName} min-h-72`}
                  placeholder="Enter complete project requirement from your client..."
                  value={originalInput}
                  onChange={(event) => setOriginalInput(event.target.value)}
                  required
                />

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="submit"
                    className="h-10 flex-1 bg-white text-black hover:bg-zinc-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles />
                        Generate Response
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {isGenerated ? (
              <Card className="border-white/15 bg-zinc-950/70 text-white">
                <CardHeader className="space-y-3 border-b border-white/10 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle>Generated Proposal</CardTitle>
                      <p className="mt-1 text-sm text-zinc-400">
                        Review the AI draft, then save it once it feels right.
                      </p>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      {status === "draft" ? "Draft mode" : "Final mode"}
                    </div>
                  </div>

                  <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 border-white/20 bg-white/5 text-white hover:bg-white/10"
                      onClick={() => setIsEditable((prev) => !prev)}
                      disabled={isSubmitting}
                    >
                      <PencilLine />
                      {isEditable ? "Disable Edit" : "Enable Edit"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 border-white/20 bg-white/5 text-white hover:bg-white/10"
                      onClick={() =>
                        setStatus((prev) =>
                          prev === "draft" ? "final" : "draft",
                        )
                      }
                      disabled={isSubmitting}
                    >
                      Save as {status === "draft" ? "Final" : "Draft"}
                    </Button>
                    <Button
                      type="button"
                      className="h-10 bg-white text-black hover:bg-zinc-200"
                      onClick={handleSave}
                      disabled={isSubmitting}
                    >
                      <Save />
                      Add to Database
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-4 p-5 md:grid-cols-2">
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Original Input
                    </p>
                    <textarea
                      className={textareaClassName}
                      value={originalInput}
                      readOnly={!isEditable}
                      onChange={(event) => setOriginalInput(event.target.value)}
                    />
                  </div>

                  {[
                    ["Scope", generated.scope],
                    ["Timeline", generated.timeline],
                    ["Pricing", generated.pricing],
                    ["Contract", generated.contract],
                  ].map(([label, value]) => (
                    <div key={label} className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                        {label}
                      </p>
                      <textarea
                        className={textareaClassName}
                        value={value}
                        readOnly={!isEditable}
                        onChange={(event) =>
                          setGenerated((prev) => ({
                            ...prev,
                            [label.toLowerCase()]: event.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-white/15 bg-zinc-950/50 text-white">
                <CardContent className="flex min-h-88 flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-10 w-10 text-zinc-400" />
                  <h2 className="mt-4 text-xl font-semibold text-white">
                    Your generated draft will appear here
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
                    Use the left panel to create a proposal response. Once the
                    draft is ready, you can unlock editing and save it to the
                    database.
                  </p>
                </CardContent>
              </Card>
            )}

            {message ? (
              <p
                className={`rounded-md border px-3 py-2 text-sm ${
                  message.type === "error"
                    ? "border-red-400/30 bg-red-500/10 text-red-200"
                    : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                }`}
              >
                {message.text}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
