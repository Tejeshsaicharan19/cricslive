export type MatchStatus = "in_progress" | "upcoming" | "completed";

export type MatchFilter = "all" | "in_progress" | "upcoming" | "completed";

export type BatterLine = {
  name: string;
  dismissal: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
};

export type BowlerLine = {
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
};

export type DeliveryEvent = {
  over: string;
  result: string;
  runs: number;
  kind: "normal" | "boundary" | "wicket" | "extra";
  note: string;
};

export type Innings = {
  id: string;
  battingTeam: string;
  score: string;
  totalRuns: number;
  wickets: number;
  overs: string;
  extras: string;
  fallOfWickets: string[];
  batters: BatterLine[];
  bowlers: BowlerLine[];
  deliveries: DeliveryEvent[];
  overSummary: string;
};

export type CricketMatch = {
  id: string;
  competition: string;
  format: string;
  venue: string;
  status: MatchStatus;
  statusLabel: string;
  teamA: { name: string; shortName: string; score: string; overs: string };
  teamB: { name: string; shortName: string; score: string; overs: string };
  toss: string;
  result: string;
  note: string;
  target?: number;
  requiredRuns?: number;
  ballsRemaining?: number;
  currentRunRate?: string;
  requiredRunRate?: string;
  currentInningsIndex: number;
  innings: Innings[];
};
