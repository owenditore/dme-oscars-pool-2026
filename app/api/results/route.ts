import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase-admin";

function isAuthorized(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  return password && password === process.env.OSCARS_ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const supabase = getAdminSupabase();
  const { data, error } = await supabase.from("results").select(`categories!inner(slug), winner_nominee:nominees!results_winner_nominee_id_fkey(label)`);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const results = Object.fromEntries((data || []).map((row: any) => [row.categories.slug, row.winner_nominee.label]));
  return NextResponse.json({ results });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { categorySlug, winnerLabel } = await req.json();
  if (!categorySlug || !winnerLabel) return NextResponse.json({ error: "categorySlug and winnerLabel are required." }, { status: 400 });

  const supabase = getAdminSupabase();
  const { data: category, error: categoryError } = await supabase.from("categories").select("id").eq("slug", categorySlug).single();
  if (categoryError || !category) return NextResponse.json({ error: categoryError?.message || "Category not found." }, { status: 500 });

  const { data: nominee, error: nomineeError } = await supabase.from("nominees").select("id").eq("category_id", category.id).eq("label", winnerLabel).single();
  if (nomineeError || !nominee) return NextResponse.json({ error: nomineeError?.message || "Nominee not found." }, { status: 500 });

  const { error: upsertError } = await supabase.from("results").upsert({ category_id: category.id, winner_nominee_id: nominee.id, entered_at: new Date().toISOString() }, { onConflict: "category_id" });
  if (upsertError) return NextResponse.json({ error: upsertError.message }, { status: 500 });

  return NextResponse.json({ ok: true, categorySlug, winnerLabel });
}
