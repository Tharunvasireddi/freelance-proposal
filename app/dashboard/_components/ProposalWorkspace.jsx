"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileSearch,
  LoaderCircle,
  LogOut,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const textareaClassName =
  "min-h-20 max-h-44 w-full resize-y rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white placeholder:text-zinc-400 focus:border-white/40 focus:outline-none";

function formatDate(value) {
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function SkeletonCard() {
  return (
    <Card className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/60 text-white">
      <CardHeader className="space-y-4 border-b border-white/10 px-5 pb-4 pt-5">
        <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
        <div className="h-6 w-36 animate-pulse rounded bg-white/15" />
        <div className="h-3 w-40 animate-pulse rounded bg-white/10" />
      </CardHeader>
      <CardContent className="grid gap-4 p-5">
        <div className="h-24 animate-pulse rounded-xl bg-white/8" />
        <div className="h-24 animate-pulse rounded-xl bg-white/8" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-20 animate-pulse rounded-xl bg-white/8" />
          <div className="h-20 animate-pulse rounded-xl bg-white/8" />
        </div>
        <div className="flex gap-2 border-t border-white/10 pt-4">
          <div className="h-10 w-28 animate-pulse rounded-lg bg-white/10" />
          <div className="h-10 w-20 animate-pulse rounded-lg bg-white/10" />
          <div className="h-10 w-24 animate-pulse rounded-lg bg-white/10" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProposalWorkspace({ user }) {
  const router = useRouter();
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState(null);
  const [query, setQuery] = useState("");

  const stats = useMemo(() => {
    const finalCount = proposals.filter(
      (proposal) => proposal.status === "final",
    ).length;
    const draftCount = proposals.length - finalCount;

    return [
      { label: "Total projects", value: proposals.length },
      { label: "Finalized", value: finalCount },
      { label: "Drafts", value: draftCount },
    ];
  }, [proposals]);

  const filteredProposals = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return proposals;

    return proposals.filter((proposal) => {
      const haystack = [
        proposal.originalInput,
        proposal.generated?.scope,
        proposal.generated?.timeline,
        proposal.generated?.pricing,
        proposal.generated?.contract,
        proposal.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [proposals, query]);

  const loadProposals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/proposals", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to load projects");
      }

      setProposals(payload.proposals || []);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const startEdit = (proposal) => {
    setEditingId(proposal._id);
    setDraft({
      originalInput: proposal.originalInput,
      generated: {
        scope: proposal.generated.scope,
        timeline: proposal.generated.timeline,
        pricing: proposal.generated.pricing,
        contract: proposal.generated.contract,
      },
      status: proposal.status,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !draft) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/proposals/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to update project");
      }

      setProposals((prev) =>
        prev.map((proposal) =>
          proposal._id === editingId ? payload.proposal : proposal,
        ),
      );
      setEditingId(null);
      setDraft(null);
      setMessage({ type: "success", text: "Project updated successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/proposals/${id}`, {
        method: "DELETE",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to delete project");
      }

      setProposals((prev) => prev.filter((proposal) => proposal._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setDraft(null);
      }
      setMessage({ type: "success", text: "Project deleted." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (proposal) => {
    const nextStatus = proposal.status === "draft" ? "final" : "draft";

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/proposals/${proposal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to update status");
      }

      setProposals((prev) =>
        prev.map((item) =>
          item._id === proposal._id ? payload.proposal : item,
        ),
      );
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/signin");
    router.refresh();
  };

  return (
    <section className="min-h-screen bg-black px-4 py-6 pb-28 text-white sm:px-6 sm:pb-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/75 p-5 shadow-2xl shadow-white/5 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                Dashboard
              </p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                Previous project works
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                Review all saved proposals, edit the content when you need to,
                and keep your freelance workflow organized in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-11 bg-white px-5 text-black hover:bg-zinc-200"
              >
                <Link href="/dashboard/new">
                  <Plus />
                  Add New Project
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 border-white/20 bg-white/5 px-5 text-white hover:bg-white/10"
                onClick={handleSignOut}
                disabled={isSubmitting}
              >
                <LogOut />
                Sign out
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </header>

        {message ? (
          <p
            className={`rounded-xl border px-4 py-3 text-sm ${
              message.type === "error"
                ? "border-red-400/30 bg-red-500/10 text-red-200"
                : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            {message.text}
          </p>
        ) : null}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              placeholder="Search projects, scope, pricing, status..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none"
            />
          </div>

          <p className="text-sm text-zinc-400">
            Showing {filteredProposals.length} of {proposals.length} projects
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))
          ) : filteredProposals.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3 rounded-3xl border border-dashed border-white/15 bg-zinc-950/60 p-10 text-center text-zinc-300">
              <div className="mx-auto flex max-w-xl flex-col items-center">
                <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <FileSearch className="h-10 w-10 text-zinc-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {query.trim()
                    ? "No matching projects found"
                    : "No projects yet"}
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
                  {query.trim()
                    ? "Try a different keyword, or clear search and create a new project."
                    : "Start by generating your first proposal project. It will appear here as a separate card."}
                </p>
                <div className="mt-6 flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row">
                  <Button
                    asChild
                    className="h-11 bg-white text-black hover:bg-zinc-200"
                  >
                    <Link href="/dashboard/new">
                      <Plus />
                      Add New Project
                    </Link>
                  </Button>
                  {query.trim() ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 border-white/20 bg-white/5 text-white hover:bg-white/10"
                      onClick={() => setQuery("")}
                    >
                      Clear Search
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            filteredProposals.map((proposal) => {
              const isEditing = editingId === proposal._id;
              const source = isEditing ? draft : proposal;

              return (
                <Card
                  key={proposal._id}
                  className="overflow-hidden rounded-3xl border border-white/20 bg-zinc-950/80 text-white shadow-xl shadow-black/30 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/35 hover:shadow-2xl hover:shadow-white/10"
                >
                  <CardHeader className="space-y-4 border-b border-white/15 bg-white/3 px-5 pb-4 pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                          Project ID
                        </p>
                        <CardTitle className="mt-1 text-lg sm:text-xl">
                          #{proposal._id.slice(-6)}
                        </CardTitle>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          proposal.status === "final"
                            ? "border-emerald-400/40 text-emerald-300"
                            : "border-amber-400/40 text-amber-300"
                        }
                      >
                        {proposal.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Updated {formatDate(proposal.updatedAt)}
                    </p>
                  </CardHeader>

                  <CardContent className="grid gap-4 p-5">
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                        Requirement
                      </p>
                      <textarea
                        className={textareaClassName}
                        value={source.originalInput}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            originalInput: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                        Scope
                      </p>
                      <textarea
                        className={textareaClassName}
                        value={source.generated.scope}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            generated: {
                              ...prev.generated,
                              scope: event.target.value,
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                          Timeline
                        </p>
                        <textarea
                          className={textareaClassName}
                          value={source.generated.timeline}
                          readOnly={!isEditing}
                          onChange={(event) =>
                            setDraft((prev) => ({
                              ...prev,
                              generated: {
                                ...prev.generated,
                                timeline: event.target.value,
                              },
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                          Pricing
                        </p>
                        <textarea
                          className={textareaClassName}
                          value={source.generated.pricing}
                          readOnly={!isEditing}
                          onChange={(event) =>
                            setDraft((prev) => ({
                              ...prev,
                              generated: {
                                ...prev.generated,
                                pricing: event.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                        Contract
                      </p>
                      <textarea
                        className={textareaClassName}
                        value={source.generated.contract}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            generated: {
                              ...prev.generated,
                              contract: event.target.value,
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="mt-1 grid gap-2 border-t border-white/10 pt-4 sm:flex sm:flex-wrap sm:items-center">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 border-white/20 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => handleStatusToggle(proposal)}
                        disabled={isSubmitting}
                      >
                        Mark as{" "}
                        {proposal.status === "draft" ? "Final" : "Draft"}
                      </Button>

                      {isEditing ? (
                        <>
                          <Button
                            type="button"
                            className="h-10 bg-white text-black hover:bg-zinc-200"
                            onClick={handleSaveEdit}
                            disabled={isSubmitting}
                          >
                            <Save />
                            Save
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 border-white/20 bg-white/5 text-white hover:bg-white/10"
                            onClick={() => {
                              setEditingId(null);
                              setDraft(null);
                            }}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 border-white/20 bg-white/5 text-white hover:bg-white/10"
                          onClick={() => startEdit(proposal)}
                          disabled={isSubmitting}
                        >
                          Edit
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="destructive"
                        className="h-10"
                        onClick={() => handleDelete(proposal._id)}
                        disabled={isSubmitting}
                      >
                        <Trash2 />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/85 p-3 backdrop-blur-xl sm:hidden">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-2">
            <Button
              asChild
              className="h-11 flex-1 bg-white text-black hover:bg-zinc-200"
            >
              <Link href="/dashboard/new">
                <Plus />
                New Project
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 border-white/20 bg-white/5 px-4 text-white hover:bg-white/10"
              onClick={handleSignOut}
              disabled={isSubmitting}
            >
              <LogOut />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
