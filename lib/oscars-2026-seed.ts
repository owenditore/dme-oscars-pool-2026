export type Category = {
  slug: string;
  name: string;
  displayOrder: number;
};

export type Nominee = {
  categorySlug: string;
  label: string;
  shortLabel: string;
  displayOrder: number;
};

export type ConfidenceScore = 0 | 1 | 2 | 3;

export type BallotPick = {
  categorySlug: string;
  firstChoice: string;
  secondChoice: string;
  confidence: ConfidenceScore;
};

export type Ballot = {
  firstName: string;
  lastName: string;
  fullNameNormalized: string;
  picks: BallotPick[];
  submittedAt: string;
  updatedAt: string;
};

export type ResultEntry = {
  categorySlug: string;
  winnerLabel: string;
  enteredAt: string;
};

export const LOCK_TIME_CT_ISO = "2026-03-15T17:00:00-05:00";
export const APP_TIMEZONE = "America/Chicago";

export const OSCARS_2026_CATEGORIES: Category[] = [
  { slug: "best-picture", name: "Best Picture", displayOrder: 1 },
  { slug: "best-director", name: "Best Director", displayOrder: 2 },
  { slug: "best-actor", name: "Best Actor", displayOrder: 3 },
  { slug: "best-actress", name: "Best Actress", displayOrder: 4 },
  { slug: "best-supporting-actor", name: "Best Supporting Actor", displayOrder: 5 },
  { slug: "best-supporting-actress", name: "Best Supporting Actress", displayOrder: 6 },
  { slug: "best-original-screenplay", name: "Best Original Screenplay", displayOrder: 7 },
  { slug: "best-adapted-screenplay", name: "Best Adapted Screenplay", displayOrder: 8 },
  { slug: "best-animated-feature-film", name: "Best Animated Feature Film", displayOrder: 9 },
  { slug: "best-international-feature-film", name: "Best International Feature Film", displayOrder: 10 },
  { slug: "best-documentary-feature-film", name: "Best Documentary Feature Film", displayOrder: 11 },
  { slug: "best-original-score", name: "Best Original Score", displayOrder: 12 },
  { slug: "best-original-song", name: "Best Original Song", displayOrder: 13 },
  { slug: "best-cinematography", name: "Best Cinematography", displayOrder: 14 },
  { slug: "best-film-editing", name: "Best Film Editing", displayOrder: 15 },
  { slug: "best-production-design", name: "Best Production Design", displayOrder: 16 },
  { slug: "best-costume-design", name: "Best Costume Design", displayOrder: 17 },
  { slug: "best-makeup-and-hairstyling", name: "Best Makeup and Hairstyling", displayOrder: 18 },
  { slug: "best-sound", name: "Best Sound", displayOrder: 19 },
  { slug: "best-visual-effects", name: "Best Visual Effects", displayOrder: 20 },
  { slug: "best-live-action-short-film", name: "Best Live Action Short Film", displayOrder: 21 },
  { slug: "best-animated-short-film", name: "Best Animated Short Film", displayOrder: 22 },
  { slug: "best-documentary-short-film", name: "Best Documentary Short Film", displayOrder: 23 },
  { slug: "achievement-in-casting", name: "Achievement in Casting", displayOrder: 24 },
];

export const OSCARS_2026_NOMINEES: Nominee[] = [
  { categorySlug: "best-picture", label: "Bugonia", shortLabel: "Bugonia", displayOrder: 1 },
  { categorySlug: "best-picture", label: "F1", shortLabel: "F1", displayOrder: 2 },
  { categorySlug: "best-picture", label: "Frankenstein", shortLabel: "Frankenstein", displayOrder: 3 },
  { categorySlug: "best-picture", label: "Hamnet", shortLabel: "Hamnet", displayOrder: 4 },
  { categorySlug: "best-picture", label: "Marty Supreme", shortLabel: "Marty Supreme", displayOrder: 5 },
  { categorySlug: "best-picture", label: "One Battle after Another", shortLabel: "One Battle after Another", displayOrder: 6 },
  { categorySlug: "best-picture", label: "The Secret Agent", shortLabel: "The Secret Agent", displayOrder: 7 },
  { categorySlug: "best-picture", label: "Sentimental Value", shortLabel: "Sentimental Value", displayOrder: 8 },
  { categorySlug: "best-picture", label: "Sinners", shortLabel: "Sinners", displayOrder: 9 },
  { categorySlug: "best-picture", label: "Train Dreams", shortLabel: "Train Dreams", displayOrder: 10 },

  { categorySlug: "best-director", label: "Hamnet", shortLabel: "Hamnet", displayOrder: 1 },
  { categorySlug: "best-director", label: "Marty Supreme", shortLabel: "Marty Supreme", displayOrder: 2 },
  { categorySlug: "best-director", label: "One Battle after Another", shortLabel: "One Battle after Another", displayOrder: 3 },
  { categorySlug: "best-director", label: "Sentimental Value", shortLabel: "Sentimental Value", displayOrder: 4 },
  { categorySlug: "best-director", label: "Sinners", shortLabel: "Sinners", displayOrder: 5 },

  { categorySlug: "best-actor", label: "Timothée Chalamet — Marty Supreme", shortLabel: "Timothée Chalamet — Marty Supreme", displayOrder: 1 },
  { categorySlug: "best-actor", label: "Leonardo DiCaprio — One Battle after Another", shortLabel: "Leonardo DiCaprio — One Battle after Another", displayOrder: 2 },
  { categorySlug: "best-actor", label: "Ethan Hawke — Blue Moon", shortLabel: "Ethan Hawke — Blue Moon", displayOrder: 3 },
  { categorySlug: "best-actor", label: "Michael B. Jordan — Sinners", shortLabel: "Michael B. Jordan — Sinners", displayOrder: 4 },
  { categorySlug: "best-actor", label: "Wagner Moura — The Secret Agent", shortLabel: "Wagner Moura — The Secret Agent", displayOrder: 5 },

  { categorySlug: "best-actress", label: "Jessie Buckley — Hamnet", shortLabel: "Jessie Buckley — Hamnet", displayOrder: 1 },
  { categorySlug: "best-actress", label: "Rose Byrne — If I Had Legs I'd Kick You", shortLabel: "Rose Byrne — If I Had Legs I'd Kick You", displayOrder: 2 },
  { categorySlug: "best-actress", label: "Kate Hudson — Song Sung Blue", shortLabel: "Kate Hudson — Song Sung Blue", displayOrder: 3 },
  { categorySlug: "best-actress", label: "Renate Reinsve — Sentimental Value", shortLabel: "Renate Reinsve — Sentimental Value", displayOrder: 4 },
  { categorySlug: "best-actress", label: "Emma Stone — Bugonia", shortLabel: "Emma Stone — Bugonia", displayOrder: 5 },

  { categorySlug: "best-supporting-actor", label: "Benicio Del Toro — One Battle after Another", shortLabel: "Benicio Del Toro — One Battle after Another", displayOrder: 1 },
  { categorySlug: "best-supporting-actor", label: "Jacob Elordi — Frankenstein", shortLabel: "Jacob Elordi — Frankenstein", displayOrder: 2 },
  { categorySlug: "best-supporting-actor", label: "Delroy Lindo — Sinners", shortLabel: "Delroy Lindo — Sinners", displayOrder: 3 },
  { categorySlug: "best-supporting-actor", label: "Sean Penn — One Battle after Another", shortLabel: "Sean Penn — One Battle after Another", displayOrder: 4 },
  { categorySlug: "best-supporting-actor", label: "Stellan Skarsgård — Sentimental Value", shortLabel: "Stellan Skarsgård — Sentimental Value", displayOrder: 5 },

  { categorySlug: "best-supporting-actress", label: "Elle Fanning — Sentimental Value", shortLabel: "Elle Fanning — Sentimental Value", displayOrder: 1 },
  { categorySlug: "best-supporting-actress", label: "Inga Ibsdotter Lilleaas — Sentimental Value", shortLabel: "Inga Ibsdotter Lilleaas — Sentimental Value", displayOrder: 2 },
  { categorySlug: "best-supporting-actress", label: "Amy Madigan — Weapons", shortLabel: "Amy Madigan — Weapons", displayOrder: 3 },
  { categorySlug: "best-supporting-actress", label: "Wunmi Mosaku — Sinners", shortLabel: "Wunmi Mosaku — Sinners", displayOrder: 4 },
  { categorySlug: "best-supporting-actress", label: "Teyana Taylor — One Battle after Another", shortLabel: "Teyana Taylor — One Battle after Another", displayOrder: 5 },

  { categorySlug: "best-original-screenplay", label: "Blue Moon", shortLabel: "Blue Moon", displayOrder: 1 },
  { categorySlug: "best-original-screenplay", label: "It Was Just an Accident", shortLabel: "It Was Just an Accident", displayOrder: 2 },
  { categorySlug: "best-original-screenplay", label: "Marty Supreme", shortLabel: "Marty Supreme", displayOrder: 3 },
  { categorySlug: "best-original-screenplay", label: "Sentimental Value", shortLabel: "Sentimental Value", displayOrder: 4 },
  { categorySlug: "best-original-screenplay", label: "Sinners", shortLabel: "Sinners", displayOrder: 5 },

  { categorySlug: "best-adapted-screenplay", label: "Bugonia", shortLabel: "Bugonia", displayOrder: 1 },
  { categorySlug: "best-adapted-screenplay", label: "Frankenstein", shortLabel: "Frankenstein", displayOrder: 2 },
  { categorySlug: "best-adapted-screenplay", label: "Hamnet", shortLabel: "Hamnet", displayOrder: 3 },
  { categorySlug: "best-adapted-screenplay", label: "One Battle after Another", shortLabel: "One Battle after Another", displayOrder: 4 },
  { categorySlug: "best-adapted-screenplay", label: "Train Dreams", shortLabel: "Train Dreams", displayOrder: 5 },

  { categorySlug: "best-animated-feature-film", label: "Arco", shortLabel: "Arco", displayOrder: 1 },
  { categorySlug: "best-animated-feature-film", label: "Elio", shortLabel: "Elio", displayOrder: 2 },
  { categorySlug: "best-animated-feature-film", label: "KPop Demon Hunters", shortLabel: "KPop Demon Hunters", displayOrder: 3 },
  { categorySlug: "best-animated-feature-film", label: "Little Amélie or the Character of Rain", shortLabel: "Little Amélie or the Character of Rain", displayOrder: 4 },
  { categorySlug: "best-animated-feature-film", label: "Zootopia 2", shortLabel: "Zootopia 2", displayOrder: 5 },

  { categorySlug: "best-international-feature-film", label: "The Secret Agent (Brazil)", shortLabel: "The Secret Agent (Brazil)", displayOrder: 1 },
  { categorySlug: "best-international-feature-film", label: "It Was Just an Accident (France)", shortLabel: "It Was Just an Accident (France)", displayOrder: 2 },
  { categorySlug: "best-international-feature-film", label: "Sentimental Value (Norway)", shortLabel: "Sentimental Value (Norway)", displayOrder: 3 },
  { categorySlug: "best-international-feature-film", label: "Sirāt (Spain)", shortLabel: "Sirāt (Spain)", displayOrder: 4 },
  { categorySlug: "best-international-feature-film", label: "The Voice of Hind Rajab (Tunisia)", shortLabel: "The Voice of Hind Rajab (Tunisia)", displayOrder: 5 },

  { categorySlug: "best-documentary-feature-film", label: "The Alabama Solution", shortLabel: "The Alabama Solution", displayOrder: 1 },
  { categorySlug: "best-documentary-feature-film", label: "Come See Me in the Good Light", shortLabel: "Come See Me in the Good Light", displayOrder: 2 },
  { categorySlug: "best-documentary-feature-film", label: "Cutting through Rocks", shortLabel: "Cutting through Rocks", displayOrder: 3 },
  { categorySlug: "best-documentary-feature-film", label: "Mr. Nobody against Putin", shortLabel: "Mr. Nobody against Putin", displayOrder: 4 },
  { categorySlug: "best-documentary-feature-film", label: "The Perfect Neighbor", shortLabel: "The Perfect Neighbor", displayOrder: 5 },

  { categorySlug: "best-original-score", label: "Bugonia", shortLabel: "Bugonia", displayOrder: 1 },
  { categorySlug: "best-original-score", label: "Frankenstein", shortLabel: "Frankenstein", displayOrder: 2 },
  { categorySlug: "best-original-score", label: "Hamnet", shortLabel: "Hamnet", displayOrder: 3 },
  { categorySlug: "best-original-score", label: "One Battle after Another", shortLabel: "One Battle after Another", displayOrder: 4 },
  { categorySlug: "best-original-score", label: "Sinners", shortLabel: "Sinners", displayOrder: 5 },

  { categorySlug: "best-original-song", label: "Dear Me — Diane Warren: Relentless", shortLabel: "Dear Me — Diane Warren: Relentless", displayOrder: 1 },
  { categorySlug: "best-original-song", label: "Golden — KPop Demon Hunters", shortLabel: "Golden — KPop Demon Hunters", displayOrder: 2 },
  { categorySlug: "best-original-song", label: "I Lied To You — Sinners", shortLabel: "I Lied To You — Sinners", displayOrder: 3 },
  { categorySlug: "best-original-song", label: "Sweet Dreams Of Joy — Viva Verdi!", shortLabel: "Sweet Dreams Of Joy — Viva Verdi!", displayOrder: 4 },
  { categorySlug: "best-original-song", label: "Train Dreams — Train Dreams", shortLabel: "Train Dreams — Train Dreams", displayOrder: 5 },

  { categorySlug: "best-cinematography", label: "Frankenstein", shortLabel: "Frankenstein", displayOrder: 1 },
  { categorySlug: "best-cinematography", label: "Marty Supreme", shortLabel: "Marty Supreme", displayOrder: 2 },
  { categorySlug: "best-cinematography", label: "One Battle after Another", shortLabel: "One Battle after Another", displayOrder: 3 },
  { categorySlug: "best-cinematography", label: "Sinners", shortLabel: "Sinners", displayOrder: 4 },
  { categorySlug: "best-cinematography", label: "Train Dreams", shortLabel: "Train Dreams", displayOrder: 5 },

  { categorySlug: "best-film-editing", label: "F1", shortLabel: "F1", displayOrder: 1 },
  { categorySlug: "best-film-editing", label: "Marty Supreme", shortLabel: "Marty Supreme", displayOrder: 2 },
  { categorySlug: "best-film-editing", label: "One Battle after Another", shortLabel: "One Battle after Another", displayOrder: 3 },
  { categorySlug: "best-film-editing", label: "Sentimental Value", shortLabel: "Sentimental Value", displayOrder: 4 },
  { categorySlug: "best-film-editing", label: "Sinners", shortLabel: "Sinners", displayOrder: 5 },

  { categorySlug: "best-production-design", label: "Frankenstein", shortLabel: "Frankenstein", displayOrder: 1 },
  { categorySlug: "best-production-design", label: "Hamnet", shortLabel: "Hamnet", displayOrder: 2 },
  { categorySlug: "best-production-design", label: "Marty Supreme", shortLabel: "Marty Supreme", displayOrder: 3 },
  { categorySlug: "best-production-design", label: "One Battle after Another", shortLabel: "One Battle after Another", displayOrder: 4 },
  { categorySlug: "best-production-design", label: "Sinners", shortLabel: "Sinners", displayOrder: 5 },

  { categorySlug: "best-costume-design", label: "Avatar: Fire and Ash", shortLabel: "Avatar: Fire and Ash", displayOrder: 1 },
  { categorySlug: "best-costume-design", label: "Frankenstein", shortLabel: "Frankenstein", displayOrder: 2 },
  { categorySlug: "best-costume-design", label: "Hamnet", shortLabel: "Hamnet", displayOrder: 3 },
  { categorySlug: "best-costume-design", label: "Marty Supreme", shortLabel: "Marty Supreme", displayOrder: 4 },
  { categorySlug: "best-costume-design", label: "Sinners", shortLabel: "Sinners", displayOrder: 5 },

  { categorySlug: "best-makeup-and-hairstyling", label: "Frankenstein", shortLabel: "Frankenstein", displayOrder: 1 },
  { categorySlug: "best-makeup-and-hairstyling", label: "Kokuho", shortLabel: "Kokuho", displayOrder: 2 },
  { categorySlug: "best-makeup-and-hairstyling", label: "Sinners", shortLabel: "Sinners", displayOrder: 3 },
  { categorySlug: "best-makeup-and-hairstyling", label: "The Smashing Machine", shortLabel: "The Smashing Machine", displayOrder: 4 },
  { categorySlug: "best-makeup-and-hairstyling", label: "The Ugly Stepsister", shortLabel: "The Ugly Stepsister", displayOrder: 5 },

  { categorySlug: "best-sound", label: "F1", shortLabel: "F1", displayOrder: 1 },
  { categorySlug: "best-sound", label: "Frankenstein", shortLabel: "Frankenstein", displayOrder: 2 },
  { categorySlug: "best-sound", label: "One Battle after Another", shortLabel: "One Battle after Another", displayOrder: 3 },
  { categorySlug: "best-sound", label: "Sinners", shortLabel: "Sinners", displayOrder: 4 },
  { categorySlug: "best-sound", label: "Sirāt", shortLabel: "Sirāt", displayOrder: 5 },

  { categorySlug: "best-visual-effects", label: "Avatar: Fire and Ash", shortLabel: "Avatar: Fire and Ash", displayOrder: 1 },
  { categorySlug: "best-visual-effects", label: "F1", shortLabel: "F1", displayOrder: 2 },
  { categorySlug: "best-visual-effects", label: "Jurassic World Rebirth", shortLabel: "Jurassic World Rebirth", displayOrder: 3 },
  { categorySlug: "best-visual-effects", label: "The Lost Bus", shortLabel: "The Lost Bus", displayOrder: 4 },
  { categorySlug: "best-visual-effects", label: "Sinners", shortLabel: "Sinners", displayOrder: 5 },

  { categorySlug: "best-live-action-short-film", label: "Butcher's Stain", shortLabel: "Butcher's Stain", displayOrder: 1 },
  { categorySlug: "best-live-action-short-film", label: "A Friend of Dorothy", shortLabel: "A Friend of Dorothy", displayOrder: 2 },
  { categorySlug: "best-live-action-short-film", label: "Jane Austen's Period Drama", shortLabel: "Jane Austen's Period Drama", displayOrder: 3 },
  { categorySlug: "best-live-action-short-film", label: "The Singers", shortLabel: "The Singers", displayOrder: 4 },
  { categorySlug: "best-live-action-short-film", label: "Two People Exchanging Saliva", shortLabel: "Two People Exchanging Saliva", displayOrder: 5 },

  { categorySlug: "best-animated-short-film", label: "Butterfly", shortLabel: "Butterfly", displayOrder: 1 },
  { categorySlug: "best-animated-short-film", label: "Forevergreen", shortLabel: "Forevergreen", displayOrder: 2 },
  { categorySlug: "best-animated-short-film", label: "The Girl Who Cried Pearls", shortLabel: "The Girl Who Cried Pearls", displayOrder: 3 },
  { categorySlug: "best-animated-short-film", label: "Retirement Plan", shortLabel: "Retirement Plan", displayOrder: 4 },
  { categorySlug: "best-animated-short-film", label: "The Three Sisters", shortLabel: "The Three Sisters", displayOrder: 5 },

  { categorySlug: "best-documentary-short-film", label: "All the Empty Rooms", shortLabel: "All the Empty Rooms", displayOrder: 1 },
  { categorySlug: "best-documentary-short-film", label: "Armed Only with a Camera: The Life and Death of Brent Renaud", shortLabel: "Armed Only with a Camera: The Life and Death of Brent Renaud", displayOrder: 2 },
  { categorySlug: "best-documentary-short-film", label: "Children No More: \"Were and Are Gone\"", shortLabel: "Children No More: \"Were and Are Gone\"", displayOrder: 3 },
  { categorySlug: "best-documentary-short-film", label: "The Devil Is Busy", shortLabel: "The Devil Is Busy", displayOrder: 4 },
  { categorySlug: "best-documentary-short-film", label: "Perfectly a Strangeness", shortLabel: "Perfectly a Strangeness", displayOrder: 5 },

  { categorySlug: "achievement-in-casting", label: "Hamnet", shortLabel: "Hamnet", displayOrder: 1 },
  { categorySlug: "achievement-in-casting", label: "Marty Supreme", shortLabel: "Marty Supreme", displayOrder: 2 },
  { categorySlug: "achievement-in-casting", label: "One Battle after Another", shortLabel: "One Battle after Another", displayOrder: 3 },
  { categorySlug: "achievement-in-casting", label: "The Secret Agent", shortLabel: "The Secret Agent", displayOrder: 4 },
  { categorySlug: "achievement-in-casting", label: "Sinners", shortLabel: "Sinners", displayOrder: 5 },
];

export function normalizeFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isBallotLocked(nowIso: string = new Date().toISOString()) {
  return new Date(nowIso).getTime() >= new Date(LOCK_TIME_CT_ISO).getTime();
}

export function validatePick(pick: BallotPick) {
  if (!pick.firstChoice) return "First choice is required.";
  if (!pick.secondChoice) return "Second choice is required.";
  if (pick.firstChoice === pick.secondChoice) return "First and second choice cannot match.";
  if (![0, 1, 2, 3].includes(pick.confidence)) return "Confidence must be between 0 and 3.";
  return null;
}

export function scoreBallot(ballot: Ballot, results: ResultEntry[]) {
  const resultsByCategory = new Map(results.map((r) => [r.categorySlug, r.winnerLabel]));

  let totalScore = 0;
  let firstChoiceHits = 0;
  let secondChoiceHits = 0;
  let confidenceWon = 0;
  let confidenceLost = 0;

  for (const pick of ballot.picks) {
    const winnerLabel = resultsByCategory.get(pick.categorySlug);
    if (!winnerLabel) continue;

    if (pick.firstChoice === winnerLabel) {
      totalScore += 3 + pick.confidence;
      firstChoiceHits += 1;
      confidenceWon += pick.confidence;
    } else {
      totalScore -= pick.confidence;
      confidenceLost += pick.confidence;
    }

    if (pick.secondChoice === winnerLabel) {
      totalScore += 1;
      secondChoiceHits += 1;
    }
  }

  return { totalScore, firstChoiceHits, secondChoiceHits, confidenceWon, confidenceLost };
}

export function sortLeaderboard<T extends Ballot>(ballots: T[], results: ResultEntry[]) {
  return ballots
    .map((ballot) => ({ ...ballot, ...scoreBallot(ballot, results) }))
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.firstChoiceHits !== a.firstChoiceHits) return b.firstChoiceHits - a.firstChoiceHits;
      if (b.secondChoiceHits !== a.secondChoiceHits) return b.secondChoiceHits - a.secondChoiceHits;
      if (a.confidenceLost !== b.confidenceLost) return a.confidenceLost - b.confidenceLost;
      if (a.lastName.toLowerCase() !== b.lastName.toLowerCase()) return a.lastName.localeCompare(b.lastName);
      return a.firstName.localeCompare(b.firstName);
    });
}

export function generateSeedSql() {
  const categoryValues = OSCARS_2026_CATEGORIES.map(
    (c) => `('${sqlEscape(c.slug)}', '${sqlEscape(c.name)}', ${c.displayOrder})`
  ).join(",\n  ");

  const nomineeValues = OSCARS_2026_NOMINEES.map(
    (n) => `('${sqlEscape(n.categorySlug)}', '${sqlEscape(n.label)}', '${sqlEscape(n.shortLabel)}', ${n.displayOrder})`
  ).join(",\n    ");

  return `insert into categories (slug, name, display_order)\nvalues\n  ${categoryValues}\non conflict (slug) do update set\n  name = excluded.name,\n  display_order = excluded.display_order;\n\ninsert into nominees (category_id, label, short_label, display_order)\nselect c.id, v.label, v.short_label, v.display_order\nfrom (\n  values\n    ${nomineeValues}\n) as v(category_slug, label, short_label, display_order)\njoin categories c on c.slug = v.category_slug\nwhere not exists (\n  select 1 from nominees n where n.category_id = c.id and n.label = v.label\n);`;
}

function sqlEscape(value: string) {
  return value.replace(/'/g, "''");
}

console.log(generateSeedSql());