import { NextRequest, NextResponse } from "next/server";
import { isBallotLocked, normalizeFullName, validatePick, OSCARS_2026_CATEGORIES, type BallotPick } from "@/lib/oscars-2026-seed";
import { getAdminSupabase } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const fullNameNormalized = req.nextUrl.searchParams.get("fullNameNormalized");
  if (!fullNameNormalized) return NextResponse.json({ error: "fullNameNormalized is required." }, { status: 400 });

  const supabase = getAdminSupabase();
  const { data: ballot, error: ballotError } = await supabase.from("ballots").select("id, first_name, last_name").eq("full_name_normalized", fullNameNormalized).maybeSingle();
  if (ballotError) return NextResponse.json({ error: ballotError.message }, { status: 500 });
  if (!ballot) return NextResponse.json({ ballot: null });

  const { data: rows, error: picksError } = await supabase
    .from("ballot_picks")
    .select(`confidence, categories!inner(slug), first_nominee:nominees!ballot_picks_first_nominee_id_fkey(label), second_nominee:nominees!ballot_picks_second_nominee_id_fkey(label)`)
    .eq("ballot_id", ballot.id);

  if (picksError) return NextResponse.json({ error: picksError.message }, { status: 500 });

  const picks: BallotPick[] = (rows || []).map((row: any) => ({
    categorySlug: row.categories.slug,
    firstChoice: row.first_nominee.label,
    secondChoice: row.second_nominee.label,
    confidence: row.confidence,
  }));

  return NextResponse.json({ ballot: { firstName: ballot.first_name, lastName: ballot.last_name, picks } });
}

export async function POST(req: NextRequest) {
  if (isBallotLocked()) return NextResponse.json({ error: "Ballots are locked." }, { status: 400 });

  const body = await req.json();
  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const picks = Array.isArray(body.picks) ? (body.picks as BallotPick[]) : [];

  if (!firstName || !lastName) return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  if (picks.length === 0) return NextResponse.json({ error: "At least one pick is required." }, { status: 400 });

  for (const pick of picks) {
    const validationError = validatePick(pick);
    if (validationError) return NextResponse.json({ error: `${pick.categorySlug}: ${validationError}` }, { status: 400 });
  }

  const fullNameNormalized = normalizeFullName(firstName, lastName);
  const supabase = getAdminSupabase();

  const { data: categoryRows, error: categoryError } = await supabase.from("categories").select("id, slug");
  if (categoryError) return NextResponse.json({ error: categoryError.message }, { status: 500 });

  const { data: nomineeRows, error: nomineeError } = await supabase.from("nominees").select("id, label, category_id");
  if (nomineeError) return NextResponse.json({ error: nomineeError.message }, { status: 500 });

  const categoryIdBySlug = new Map((categoryRows || []).map((row) => [row.slug, row.id]));
  const nomineeIdByKey = new Map((nomineeRows || []).map((row) => [`${row.category_id}::${row.label}`, row.id]));

  const { data: ballot, error: ballotError } = await supabase
    .from("ballots")
    .upsert({ first_name: firstName, last_name: lastName, full_name_normalized: fullNameNormalized, updated_at: new Date().toISOString() }, { onConflict: "full_name_normalized" })
    .select("id")
    .single();

  if (ballotError || !ballot) return NextResponse.json({ error: ballotError?.message || "Could not save ballot." }, { status: 500 });

  const ballotPickRows = picks.map((pick) => {
    const categoryId = categoryIdBySlug.get(pick.categorySlug);
    const firstNomineeId = nomineeIdByKey.get(`${categoryId}::${pick.firstChoice}`);
    const secondNomineeId = nomineeIdByKey.get(`${categoryId}::${pick.secondChoice}`);
    if (!categoryId || !firstNomineeId || !secondNomineeId) throw new Error(`Nominee lookup failed for ${pick.categorySlug}.`);
    return { ballot_id: ballot.id, category_id: categoryId, first_nominee_id: firstNomineeId, second_nominee_id: secondNomineeId, confidence: pick.confidence };
  });

  const { error: deleteError } = await supabase.from("ballot_picks").delete().eq("ballot_id", ballot.id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  const { error: insertError } = await supabase.from("ballot_picks").insert(ballotPickRows);
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ ok: true, ballotId: ballot.id, picksSaved: ballotPickRows.length });
}