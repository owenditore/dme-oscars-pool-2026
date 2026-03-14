import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase-admin";
import type { Ballot, BallotPick, ResultEntry } from "@/lib/oscars-2026-seed";

export async function GET() {
  const supabase = getAdminSupabase();

  const { data: ballots, error: ballotsError } = await supabase.from("ballots").select("id, first_name, last_name, full_name_normalized, submitted_at, updated_at").order("last_name", { ascending: true }).order("first_name", { ascending: true });
  if (ballotsError) return NextResponse.json({ error: ballotsError.message }, { status: 500 });

  const { data: picks, error: picksError } = await supabase
    .from("ballot_picks")
    .select(`ballot_id, confidence, categories!inner(slug), first_nominee:nominees!ballot_picks_first_nominee_id_fkey(label), second_nominee:nominees!ballot_picks_second_nominee_id_fkey(label)`);
  if (picksError) return NextResponse.json({ error: picksError.message }, { status: 500 });

  const { data: resultsRows, error: resultsError } = await supabase
    .from("results")
    .select(`entered_at, categories!inner(slug), winner_nominee:nominees!results_winner_nominee_id_fkey(label)`);
  if (resultsError) return NextResponse.json({ error: resultsError.message }, { status: 500 });

  const picksByBallotId = new Map<string, BallotPick[]>();
  for (const row of picks || []) {
    const list = picksByBallotId.get((row as any).ballot_id) || [];
    list.push({ categorySlug: (row as any).categories.slug, firstChoice: (row as any).first_nominee.label, secondChoice: (row as any).second_nominee.label, confidence: (row as any).confidence });
    picksByBallotId.set((row as any).ballot_id, list);
  }

  const normalizedBallots: Ballot[] = (ballots || []).map((row: any) => ({
    firstName: row.first_name,
    lastName: row.last_name,
    fullNameNormalized: row.full_name_normalized,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
    picks: picksByBallotId.get(row.id) || [],
  }));

  const results: ResultEntry[] = (resultsRows || []).map((row: any) => ({ categorySlug: row.categories.slug, winnerLabel: row.winner_nominee.label, enteredAt: row.entered_at }));
  return NextResponse.json({ ballots: normalizedBallots, results });
}