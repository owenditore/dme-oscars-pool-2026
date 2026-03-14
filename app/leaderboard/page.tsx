"use client";

import { useEffect, useState } from "react";
import { sortLeaderboard, type Ballot, type ResultEntry, OSCARS_2026_CATEGORIES } from "@/lib/oscars-2026-seed";

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

const card: React.CSSProperties = {
  background: "rgba(22,24,27,0.92)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
  borderRadius: 28,
};

export default function LeaderboardPage() {
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    let timer: number | undefined;
    async function load() {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      const data = await res.json();
      setBallots(data.ballots || []);
      setResults(data.results || []);
    }
    load();
    timer = window.setInterval(load, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const ranked = sortLeaderboard(ballots, results);
  const resultsMap = new Map(results.map((r) => [r.categorySlug, r.winnerLabel]));

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, rgba(201,163,58,0.08), transparent 35%), linear-gradient(to bottom, #0b0b0c, #0d0f12 35%, #0b0b0c 100%)", color: "#F3F3F3", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", padding: isMobile ? 12 : 20 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ ...card, padding: isMobile ? 20 : 28, marginBottom: 20 }}>
          <div style={{ display: "inline-flex", padding: "6px 12px", borderRadius: 999, background: "rgba(201,163,58,0.14)", border: "1px solid rgba(201,163,58,0.28)", color: "#F2D98A", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            DME Oscars Pool 2026
          </div>
          <div style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: isMobile ? 36 : 54, marginTop: 16, lineHeight: 1.05, fontWeight: 700 }}>Live Leaderboard</div>
          <div style={{ marginTop: 10, fontSize: isMobile ? 15 : 18, color: "#D7D9DD" }}>Winners will appear here as they're announced. Scores update automatically throughout the night.</div>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.08fr 0.92fr", gap: 20 }}>

          {/* Standings */}
          <div style={{ ...card, padding: isMobile ? 20 : 24 }}>
            <div style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: 34, fontWeight: 700, marginBottom: 16 }}>Standings</div>
            {ranked.length === 0 ? (
              <div style={{ color: "#A6ADB7", fontSize: 14 }}>No ballots submitted yet.</div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {ranked.map((user, index) => (
                  <div key={`${user.firstName}-${user.lastName}`} style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", borderRadius: 22, padding: isMobile ? 14 : 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ height: 40, width: 40, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,163,58,0.14)", color: "#F2D98A", fontWeight: 700, flexShrink: 0, fontSize: 14 }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700 }}>{user.firstName} {user.lastName}</div>
                          <div style={{ marginTop: 3, fontSize: 12, color: "#A6ADB7" }}>
                            {user.firstChoiceHits} first · {user.secondChoiceHits} second · {(() => { const net = user.confidenceWon - user.confidenceLost; return net > 0 ? `+${net} confidence` : net < 0 ? `${net} confidence` : `0 confidence`; })()}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: isMobile ? 26 : 34, fontWeight: 700 }}>{user.totalScore}</div>
                        <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#A6ADB7" }}>pts</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results Progress */}
          <div style={{ ...card, padding: isMobile ? 20 : 24 }}>
            <div style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: 34, fontWeight: 700, marginBottom: 16 }}>Results Progress</div>
            <div style={{ display: "grid", gap: 10 }}>
              {OSCARS_2026_CATEGORIES.map((cat) => (
                <div key={cat.slug} style={{ display: "flex", justifyContent: "space-between", gap: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", borderRadius: 22, padding: 14, fontSize: 14 }}>
                  <div style={{ fontWeight: 600 }}>{cat.name}</div>
                  <div style={{ color: resultsMap.get(cat.slug) ? "#F2D98A" : "#A6ADB7", textAlign: "right", maxWidth: "50%" }}>
                    {resultsMap.get(cat.slug) || "Pending"}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Back link */}
        <div style={{ marginTop: 24 }}>
          <a href="/" style={{ padding: "12px 18px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#F3F3F3", fontWeight: 500, fontSize: 14, textDecoration: "none" }}>
            ← Back to ballot
          </a>
        </div>

      </div>
    </div>
  );
}