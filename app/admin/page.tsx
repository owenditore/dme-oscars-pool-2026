"use client";

import { useEffect, useState } from "react";
import { OSCARS_2026_CATEGORIES, OSCARS_2026_NOMINEES } from "@/lib/oscars-2026-seed";

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

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/results", {
        cache: "no-store",
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      setResults(data.results || {});
    }
    if (unlocked) load();
  }, [unlocked, password]);

  async function saveWinner(categorySlug: string, winnerLabel: string) {
    const res = await fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ categorySlug, winnerLabel }),
    });
    const data = await res.json();
    if (!res.ok) { setMessage(data.error || "Could not save result."); return; }
    setResults((cur) => ({ ...cur, [categorySlug]: winnerLabel }));
    setMessage("Winner saved.");
  }

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, rgba(201,163,58,0.08), transparent 35%), linear-gradient(to bottom, #0b0b0c, #0d0f12 35%, #0b0b0c 100%)", color: "#F3F3F3", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ ...card, padding: 28, marginBottom: 24 }}>
          <div style={{ display: "inline-flex", padding: "6px 12px", borderRadius: 999, background: "rgba(201,163,58,0.14)", border: "1px solid rgba(201,163,58,0.28)", color: "#F2D98A", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Admin
          </div>
          <div style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: 54, marginTop: 18, lineHeight: 1.05, fontWeight: 700 }}>Results Entry</div>
          <div style={{ marginTop: 10, fontSize: 18, color: "#D7D9DD" }}>Select each winner as it's announced. Scores will update for everyone automatically.</div>
        </div>

        {/* Password unlock */}
        {!unlocked ? (
          <div style={{ ...card, padding: 24, marginBottom: 24 }}>
            <div style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Enter admin password to continue</div>
            <div style={{ display: "flex", gap: 12 }}>
              <input
                type="password"
                style={{ ...inputStyle, maxWidth: 320 }}
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") setUnlocked(true); }}
              />
              <button style={btnGold} onClick={() => setUnlocked(true)}>Unlock</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {OSCARS_2026_CATEGORIES.map((cat) => {
              const nominees = OSCARS_2026_NOMINEES.filter((n) => n.categorySlug === cat.slug);
              return (
                <div key={cat.slug} style={{ ...card, padding: 20, borderRadius: 24 }}>
                  <div style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{cat.name}</div>
                  <select
                    style={inputStyle}
                    value={results[cat.slug] || ""}
                    onChange={(e) => saveWinner(cat.slug, e.target.value)}
                  >
                    <option value="">Select winner</option>
                    {nominees.map((n) => (
                      <option key={n.label} value={n.label}>{n.label}</option>
                    ))}
                  </select>
                  {results[cat.slug] && (
                    <div style={{ marginTop: 8, fontSize: 13, color: "#F2D98A" }}>✓ {results[cat.slug]}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {message && (
          <div style={{ marginTop: 16, fontSize: 14, color: "#F2D98A" }}>{message}</div>
        )}

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