"use client";

import { useMemo, useState, useEffect } from "react";
import {
  OSCARS_2026_CATEGORIES,
  OSCARS_2026_NOMINEES,
  type BallotPick,
  type ConfidenceScore,
  isBallotLocked,
  normalizeFullName,
  validatePick,
} from "@/lib/oscars-2026-seed";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function getNomineesForCategory(categorySlug: string) {
  return OSCARS_2026_NOMINEES
    .filter((n) => n.categorySlug === categorySlug)
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
      OSCARS_2026_CATEGORIES.map((cat) => [
        cat.slug,
        { categorySlug: cat.slug, firstChoice: "", secondChoice: "", confidence: 0 as ConfidenceScore },
      ])
    ),
  };
}

const card: React.CSSProperties = {
  background: "rgba(22,24,27,0.92)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
  borderRadius: 28,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#1B1E22",
  color: "#F3F3F3",
  fontSize: 14,
  boxSizing: "border-box",
};

const btnGold: React.CSSProperties = {
  padding: "12px 22px",
  borderRadius: 16,
  border: "none",
  background: "#C9A33A",
  color: "#111",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 15,
};

const btnDark: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "transparent",
  color: "#F3F3F3",
  fontWeight: 500,
  cursor: "pointer",
  fontSize: 14,
  textDecoration: "none",
  display: "inline-block",
};

export default function BallotPage() {
  const [draft, setDraft] = useState<DraftBallot>(makeEmptyDraft());
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const locked = isBallotLocked();
  const isMobile = useIsMobile();

  const completionCount = useMemo(() =>
    OSCARS_2026_CATEGORIES.filter((cat) => {
      const p = draft.picks[cat.slug];
      return p.firstChoice && p.secondChoice;
    }).length,
  [draft]);

  function updatePick(slug: string, field: keyof BallotPick, value: string | number) {
    setDraft((cur) => ({
      ...cur,
      picks: {
        ...cur.picks,
        [slug]: {
          ...cur.picks[slug],
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
    const q = new URLSearchParams({ fullNameNormalized: normalizeFullName(draft.firstName, draft.lastName) });
    const res = await fetch(`/api/ballot?${q}`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) { setStatus(data.error || "Could not load ballot."); return; }
    if (!data.ballot) { setStatus("No existing ballot found for that name yet."); return; }
    const picksRecord = Object.fromEntries(data.ballot.picks.map((p: BallotPick) => [p.categorySlug, p]));
    setDraft({ firstName: data.ballot.firstName, lastName: data.ballot.lastName, picks: { ...makeEmptyDraft().picks, ...picksRecord } });
    setStatus("Existing ballot loaded.");
  }

  async function handleSubmit() {
    if (locked) { setStatus("Ballots are locked. The show is live."); return; }
    if (!draft.firstName.trim() || !draft.lastName.trim()) { setStatus("First and last name are required."); return; }
    const filledPicks = Object.values(draft.picks).filter(
      (p) => p.firstChoice && p.secondChoice && p.firstChoice !== p.secondChoice
    );
    if (filledPicks.length === 0) {
      setStatus("Please fill out at least one category before submitting.");
      return;
    }
    const payload = {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      fullNameNormalized: normalizeFullName(draft.firstName, draft.lastName),
      picks: filledPicks,
    };
    setIsSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/ballot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setStatus(data.error || "Could not save ballot."); return; }
      setStatus("Your ballot is in. You can return and update it until 5:00 PM CT.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, rgba(201,163,58,0.08), transparent 35%), linear-gradient(to bottom, #0b0b0c, #0d0f12 35%, #0b0b0c 100%)", color: "#F3F3F3", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", padding: isMobile ? 12 : 20 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ ...card, padding: isMobile ? 20 : 28, marginBottom: 20 }}>
          <div style={{ display: "inline-flex", padding: "6px 12px", borderRadius: 999, background: "rgba(201,163,58,0.14)", border: "1px solid rgba(201,163,58,0.28)", color: "#F2D98A", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            DME Oscars Pool 2026
          </div>
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr", marginTop: 16 }}>
            <div>
              <div style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: isMobile ? 36 : 54, lineHeight: 1.05, fontWeight: 700 }}>Call it before the Academy does.</div>
              <div style={{ marginTop: 10, fontSize: isMobile ? 16 : 22, color: "#D7D9DD" }}>Everyone has takes. Tonight we score them.</div>
              <div style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: "#A6ADB7" }}>Make your picks for all 24 Academy Awards categories, lock in your confidence bets, and watch the live leaderboard update throughout the show.</div>
            </div>
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 14 }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: "#A6ADB7" }}>Ballots lock</div>
                <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700 }}>5:00 PM CT</div>
                <div style={{ fontSize: 13, color: "#A6ADB7" }}>Sunday, March 15</div>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 14 }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: "#A6ADB7" }}>Progress</div>
                <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700 }}>{completionCount}/24</div>
                <div style={{ fontSize: 13, color: "#A6ADB7" }}>Categories complete</div>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 14, gridColumn: "1 / span 2" }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: "#A6ADB7" }}>How it works</div>
                <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.7, color: "#D7D9DD" }}>First choice = 3 points. Second choice = 1 point. Confidence = 0–3 on your first choice. Get it right and add those points. Miss and lose them.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Name + Rules */}
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: isMobile ? "1fr" : "0.9fr 1.1fr", marginBottom: 20 }}>
          <div style={{ ...card, padding: isMobile ? 20 : 24 }}>
            <div style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: 30, fontWeight: 700 }}>Start your ballot</div>
            <div style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7, color: "#A6ADB7" }}>Enter your first and last name to create or reopen your ballot. If you return before the deadline using the same name, your ballot will reopen for edits.</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginTop: 16 }}>
              <input style={inputStyle} placeholder="First name" value={draft.firstName} onChange={(e) => setDraft((c) => ({ ...c, firstName: e.target.value }))} disabled={locked} />
              <input style={inputStyle} placeholder="Last name" value={draft.lastName} onChange={(e) => setDraft((c) => ({ ...c, lastName: e.target.value }))} disabled={locked} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button style={btnDark} onClick={loadExistingBallot} disabled={isSaving}>Load existing ballot</button>
              <a href="/leaderboard" style={btnDark}>View leaderboard</a>
            </div>
            <div style={{ marginTop: 16, border: "1px solid rgba(201,163,58,0.2)", background: "rgba(201,163,58,0.08)", borderRadius: 18, padding: 14, color: "#E9D49A", fontSize: 14, lineHeight: 1.6 }}>
              {locked ? "Ballots are locked. The show is live. Head to the leaderboard to follow the action." : "Ballots lock at 5:00 PM CT on Sunday, March 15."}
            </div>
            {status ? <div style={{ marginTop: 12, fontSize: 14 }}>{status}</div> : null}
          </div>
          <div style={{ ...card, padding: isMobile ? 20 : 24 }}>
            <div style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: 30, fontWeight: 700 }}>Rules</div>
            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.7, color: "#D7D9DD" }}>
              <div>For every category, choose your first choice, your second choice, and a confidence score from 0 to 3 on your first choice.</div>
              <div style={{ marginTop: 10 }}>Tie breakers: most first-choice hits, then most second-choice hits, then lowest confidence lost.</div>
            </div>
          </div>
        </div>

        {/* Category picks */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
          {OSCARS_2026_CATEGORIES.map((cat) => {
            const pick = draft.picks[cat.slug];
            const nominees = getNomineesForCategory(cat.slug);
            const complete = !!(pick.firstChoice && pick.secondChoice);
            return (
              <div key={cat.slug} style={{ ...card, padding: 18, borderRadius: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                  <div style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: 20, lineHeight: 1.2 }}>{cat.name}</div>
                  <div style={{ padding: "5px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: complete ? "#F2D98A" : "#A6ADB7", background: complete ? "rgba(201,163,58,0.14)" : "rgba(255,255,255,0.04)", border: complete ? "1px solid rgba(201,163,58,0.28)" : "1px solid rgba(255,255,255,0.1)", whiteSpace: "nowrap" }}>
                    {complete ? "Ready" : "Open"}
                  </div>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <select style={inputStyle} value={pick.firstChoice} onChange={(e) => updatePick(cat.slug, "firstChoice", e.target.value)} disabled={locked}>
                    <option value="">First choice</option>
                    {nominees.map((n) => <option key={n.label} value={n.label}>{n.label}</option>)}
                  </select>
                  <select style={inputStyle} value={pick.secondChoice} onChange={(e) => updatePick(cat.slug, "secondChoice", e.target.value)} disabled={locked}>
                    <option value="">Second choice</option>
                    {nominees.filter((n) => n.label !== pick.firstChoice).map((n) => <option key={n.label} value={n.label}>{n.label}</option>)}
                  </select>
                  <select style={inputStyle} value={String(pick.confidence)} onChange={(e) => updatePick(cat.slug, "confidence", Number(e.target.value))} disabled={locked}>
                    {[0, 1, 2, 3].map((s) => <option key={s} value={s}>Confidence: {s}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <button style={btnGold} onClick={handleSubmit} disabled={locked || isSaving}>
            {isSaving ? "Saving..." : "Submit ballot"}
          </button>
          {status === "Your ballot is in. You can return and update it until 5:00 PM CT." && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 16, background: "rgba(201,163,58,0.14)", border: "1px solid rgba(201,163,58,0.28)", color: "#F2D98A", fontWeight: 600, fontSize: 14 }}>
              ✓ Ballot submitted!
            </div>
          )}
          {status && status !== "Your ballot is in. You can return and update it until 5:00 PM CT." && (
            <div style={{ fontSize: 14, color: "#F3F3F3" }}>{status}</div>
          )}
        </div>

      </div>
    </div>
  );
}