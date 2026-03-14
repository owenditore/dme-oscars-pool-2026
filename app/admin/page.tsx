"use client";

import { useEffect, useState } from "react";
import { OSCARS_2026_CATEGORIES, OSCARS_2026_NOMINEES } from "@/lib/oscars-2026-seed";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/results", {
        cache: "no-store",
        headers: { "x-admin-password": password },
      });
      const data = await response.json();
      setResults(data.results || {});
    }
    if (unlocked) load();
  }, [unlocked, password]);

  async function saveWinner(categorySlug: string, winnerLabel: string) {
    const response = await fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ categorySlug, winnerLabel }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Could not save result.");
      return;
    }

    setResults((current) => ({ ...current, [categorySlug]: winnerLabel }));
    setMessage("Winner saved.");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <section className="card-dark rounded-[32px] p-6 md:p-10">
        <div className="gold-pill inline-flex rounded-full px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase">Admin</div>
        <h1 className="heading-font mt-5 text-4xl md:text-6xl">Results Entry</h1>
        <p className="mt-3 text-lg text-[#D7D9DD]">Select each winner as it’s announced. Scores will update for everyone automatically.</p>
      </section>

      {!unlocked ? (
        <section className="card-dark mt-6 rounded-[28px] p-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <input type="password" className="input-dark" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="button-gold rounded-2xl px-5 py-3 font-semibold" onClick={() => setUnlocked(true)}>Unlock</button>
          </div>
        </section>
      ) : (
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {OSCARS_2026_CATEGORIES.map((category) => {
            const nominees = OSCARS_2026_NOMINEES.filter((n) => n.categorySlug === category.slug);
            return (
              <div key={category.slug} className="card-dark rounded-[24px] p-5">
                <div className="mb-3 text-lg font-semibold">{category.name}</div>
                <select className="select-dark" value={results[category.slug] || ""} onChange={(e) => saveWinner(category.slug, e.target.value)}>
                  <option value="">Select winner</option>
                  {nominees.map((nominee) => <option key={nominee.label} value={nominee.label}>{nominee.label}</option>)}
                </select>
              </div>
            );
          })}
        </section>
      )}

      {message ? <p className="mt-4 text-sm text-[#F3F3F3]">{message}</p> : null}
    </main>
  );
}
