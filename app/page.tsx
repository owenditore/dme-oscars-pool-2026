"use client";

import { useMemo, useState } from "react";
import {
  APP_TIMEZONE,
  LOCK_TIME_CT_ISO,
  OSCARS_2026_CATEGORIES,
  OSCARS_2026_NOMINEES,
  type BallotPick,
  type ConfidenceScore,
  isBallotLocked,
  normalizeFullName,
  validatePick,
} from "@/lib/oscars-2026-seed";

function getNomineesForCategory(categorySlug: string) {
  return OSCARS_2026_NOMINEES
    .filter((nominee) => nominee.categorySlug === categorySlug)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

type DraftBallot = {
  firstName: string;
  lastName: string;
  picks: Record<string, BallotPick>;
};

function makeEmptyDraft(): DraftBallot {
  return {
    firstName: "",
    lastName: "",
    picks: Object.fromEntries(
      OSCARS_2026_CATEGORIES.map((category) => [
        category.slug,
        {
          categorySlug: category.slug,
          firstChoice: "",
          secondChoice: "",
          confidence: 0 as ConfidenceScore,
        },
      ])
    ),
  };
}

export default function BallotPage() {
  const [draft, setDraft] = useState<DraftBallot>(makeEmptyDraft());
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const locked = isBallotLocked();

  const completionCount = useMemo(() => {
    return OSCARS_2026_CATEGORIES.filter((category) => {
      const pick = draft.picks[category.slug];
      return pick.firstChoice && pick.secondChoice;
    }).length;
  }, [draft]);

  function updatePick(categorySlug: string, field: keyof BallotPick, value: string | number) {
    setDraft((current) => ({
      ...current,
      picks: {
        ...current.picks,
        [categorySlug]: {
          ...current.picks[categorySlug],
          [field]: field === "confidence" ? Number(value) : value,
        },
      },
    }));
  }

  async function loadExistingBallot() {
    if (!draft.firstName.trim() || !draft.lastName.trim()) {
      setStatus("Enter first and last name first.");
      return;
    }

    const query = new URLSearchParams({
      fullNameNormalized: normalizeFullName(draft.firstName, draft.lastName),
    });

    const response = await fetch(`/api/ballot?${query.toString()}`, { cache: "no-store" });
    const result = await response.json();

    if (!response.ok) {
      setStatus(result.error || "Could not load ballot.");
      return;
    }

    if (!result.ballot) {
      setStatus("No existing ballot found for that name yet.");
      return;
    }

    const picksRecord = Object.fromEntries(result.ballot.picks.map((pick: BallotPick) => [pick.categorySlug, pick]));

    setDraft({
      firstName: result.ballot.firstName,
      lastName: result.ballot.lastName,
      picks: { ...makeEmptyDraft().picks, ...picksRecord },
    });
    setStatus("Existing ballot loaded.");
  }

  async function handleSubmit() {
    if (locked) {
      setStatus("Ballots are locked. The show is live.");
      return;
    }

    if (!draft.firstName.trim() || !draft.lastName.trim()) {
      setStatus("First and last name are required.");
      return;
    }

    for (const category of OSCARS_2026_CATEGORIES) {
      const error = validatePick(draft.picks[category.slug]);
      if (error) {
        setStatus(`${category.name}: ${error}`);
        return;
      }
    }

    const payload = {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      fullNameNormalized: normalizeFullName(draft.firstName, draft.lastName),
      picks: Object.values(draft.picks),
    };

    setIsSaving(true);
    setStatus("");

    try {
      const response = await fetch("/api/ballot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus(result.error || "Could not save ballot.");
        return;
      }

      setStatus("Your ballot is in. You can return and update it until 5:00 PM CT.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <section className="card-dark relative overflow-hidden rounded-[32px] p-6 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,163,58,0.12),transparent_28%)]" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="gold-pill inline-flex rounded-full px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase">
              DME Oscars Pool 2026
            </div>
            <h1 className="heading-font mt-5 text-4xl leading-tight md:text-6xl">Call it before the Academy does.</h1>
            <p className="mt-3 text-lg text-[#D7D9DD] md:text-xl">Everyone has takes. Tonight we score them.</p>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-[#A6ADB7] md:text-base">
              Make your picks for all 24 Academy Awards categories, lock in your confidence bets, and watch the live leaderboard update throughout the show.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-[#A6ADB7]">Ballots lock</div>
              <div className="mt-2 text-lg font-semibold text-[#F3F3F3]">5:00 PM CT</div>
              <div className="text-sm text-[#A6ADB7]">Sunday, March 15</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-[#A6ADB7]">Progress</div>
              <div className="mt-2 text-lg font-semibold text-[#F3F3F3]">{completionCount}/24</div>
              <div className="text-sm text-[#A6ADB7]">Categories complete</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
              <div className="text-xs uppercase tracking-[0.16em] text-[#A6ADB7]">How it works</div>
              <div className="mt-2 text-sm leading-6 text-[#D7D9DD]">
                First choice = 3 points. Second choice = 1 point. Confidence = 0–3 on your first choice. Get it right and add those points. Miss and lose them.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card-dark rounded-[28px] p-6">
          <h2 className="heading-font text-2xl">Start your ballot</h2>
          <p className="mt-2 text-sm leading-6 text-[#A6ADB7]">
            Enter your first and last name to create or reopen your ballot. If you return before the deadline using the same name, your ballot will reopen for edits.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input className="input-dark" placeholder="First name" value={draft.firstName} onChange={(e) => setDraft((c) => ({ ...c, firstName: e.target.value }))} disabled={locked} />
            <input className="input-dark" placeholder="Last name" value={draft.lastName} onChange={(e) => setDraft((c) => ({ ...c, lastName: e.target.value }))} disabled={locked} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="button-dark rounded-2xl px-5 py-3 font-medium" onClick={loadExistingBallot} disabled={isSaving}>Load existing ballot</button>
            <a href="/leaderboard" className="button-dark rounded-2xl px-5 py-3 font-medium">View leaderboard</a>
          </div>
          <div className="mt-6 rounded-2xl border border-[rgba(201,163,58,0.2)] bg-[rgba(201,163,58,0.08)] p-4 text-sm leading-6 text-[#E9D49A]">
            {locked ? "Ballots are locked. The show is live. Head to the leaderboard to follow the action." : `Ballots lock at 5:00 PM CT. Timezone: ${APP_TIMEZONE}. Lock timestamp: ${LOCK_TIME_CT_ISO}.`}
          </div>
          {status ? <p className="mt-4 text-sm text-[#F3F3F3]">{status}</p> : null}
        </div>

        <div className="card-dark rounded-[28px] p-6">
          <h2 className="heading-font text-2xl">Rules</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-[#D7D9DD]">
            <p>For every category, choose your first choice, your second choice, and a confidence score from 0 to 3 on your first choice.</p>
            <p>Tie breakers: most first-choice hits, then most second-choice hits, then lowest confidence lost.</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {OSCARS_2026_CATEGORIES.map((category) => {
          const pick = draft.picks[category.slug];
          const nominees = getNomineesForCategory(category.slug);
          const complete = !!(pick.firstChoice && pick.secondChoice);

          return (
            <section key={category.slug} className="card-dark rounded-[24px] p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="heading-font text-xl leading-tight">{category.name}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${complete ? "gold-pill" : "border border-white/10 bg-white/5 text-[#A6ADB7]"}`}>
                  {complete ? "Ready" : "Open"}
                </span>
              </div>
              <div className="space-y-3">
                <select className="select-dark" value={pick.firstChoice} onChange={(e) => updatePick(category.slug, "firstChoice", e.target.value)} disabled={locked}>
                  <option value="">First choice</option>
                  {nominees.map((nominee) => <option key={nominee.label} value={nominee.label}>{nominee.label}</option>)}
                </select>
                <select className="select-dark" value={pick.secondChoice} onChange={(e) => updatePick(category.slug, "secondChoice", e.target.value)} disabled={locked}>
                  <option value="">Second choice</option>
                  {nominees.filter((nominee) => nominee.label !== pick.firstChoice).map((nominee) => <option key={nominee.label} value={nominee.label}>{nominee.label}</option>)}
                </select>
                <select className="select-dark" value={String(pick.confidence)} onChange={(e) => updatePick(category.slug, "confidence", Number(e.target.value))} disabled={locked}>
                  {[0, 1, 2, 3].map((score) => <option key={score} value={score}>{`Confidence: ${score}`}</option>)}
                </select>
              </div>
            </section>
          );
        })}
      </section>

      <div className="mt-8 flex items-center gap-4">
        <button className="button-gold rounded-2xl px-5 py-3 font-semibold" onClick={handleSubmit} disabled={locked || isSaving}>{isSaving ? "Saving..." : "Submit ballot"}</button>
      </div>
    </main>
  );
}