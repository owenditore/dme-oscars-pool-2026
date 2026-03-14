"use client";

import { useEffect, useState } from "react";
import { sortLeaderboard, type Ballot, type ResultEntry, OSCARS_2026_CATEGORIES } from "@/lib/oscars-2026-seed";

export default function LeaderboardPage() {
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [results, setResults] = useState<ResultEntry[]>([]);

  useEffect(() => {
    let timer: number | undefined;
    async function load() {
      const response = await fetch("/api/leaderboard", { cache: "no-store" });
      const data = await response.json();
      setBallots(data.ballots || []);
      setResults(data.results || []);
    }
    load();
    timer = window.setInterval(load, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const ranked = sortLeaderboard(ballots, results);
  const resultsMap = new Map(results.map((entry) => [entry.categorySlug, entry.winnerLabel]));

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <section className="card-dark rounded-[32px] p-6 md:p-10">
        <div className="gold-pill inline-flex rounded-full px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase">DME Oscars Pool 2026</div>
        <h1 className="heading-font mt-5 text-4xl md:text-6xl">Live Leaderboard</h1>
        <p className="mt-3 text-lg text-[#D7D9DD]">Winners will appear here as they’re announced. Scores update automatically throughout the night.</p>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="card-dark rounded-[28px] p-6">
          <h2 className="heading-font mb-4 text-2xl">Standings</h2>
          <div className="space-y-3">
            {ranked.map((user, index) => (
              <div key={`${user.firstName}-${user.lastName}`} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(201,163,58,0.14)] text-sm font-semibold text-[#F2D98A]">{index + 1}</div>
                    <div>
                      <div className="text-lg font-semibold">{user.firstName} {user.lastName}</div>
                      <div className="mt-1 text-sm text-[#A6ADB7]">{user.firstChoiceHits} first-choice hits • {user.secondChoiceHits} second-choice hits • {user.confidenceLost} confidence lost</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-semibold text-[#F3F3F3]">{user.totalScore}</div>
                    <div className="text-xs uppercase tracking-[0.16em] text-[#A6ADB7]">Points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card-dark rounded-[28px] p-6">
          <h2 className="heading-font mb-4 text-2xl">Results Progress</h2>
          <div className="space-y-3">
            {OSCARS_2026_CATEGORIES.map((category) => (
              <div key={category.slug} className="flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 text-sm">
                <div className="font-medium text-[#F3F3F3]">{category.name}</div>
                <div className="max-w-[48%] truncate text-right text-[#A6ADB7]">{resultsMap.get(category.slug) || "Pending"}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
