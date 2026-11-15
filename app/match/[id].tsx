import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CommentaryTimeline } from "@/components/cricket/CommentaryTimeline";
import { InningsScorecard } from "@/components/cricket/InningsScorecard";
import { SampleNotice } from "@/components/cricket/SampleNotice";
import { ScreenContainer } from "@/components/screen-container";
import { CricketPalette, CricketType } from "@/constants/cricket-design";
import { getSampleMatch } from "@/data/sampleMatches";
import { useFavorites } from "@/lib/favorites";

type DetailTab = "summary" | "scorecard" | "commentary";
const detailTabs: { key: DetailTab; label: string; icon: "notes" | "table-chart" | "forum" }[] = [
  { key: "summary", label: "Summary", icon: "notes" }, { key: "scorecard", label: "Scorecard", icon: "table-chart" }, { key: "commentary", label: "Ball-by-ball", icon: "forum" },
];

function ScoreLine({ name, short, score, overs, accent = false }: { name: string; short: string; score: string; overs: string; accent?: boolean }) {
  return (
    <View style={styles.scoreLine}>
      <View style={[styles.teamInitial, accent && styles.teamInitialAccent]}><Text style={[styles.teamInitialText, accent && styles.teamInitialTextAccent]}>{short.slice(0, 1)}</Text></View>
      <Text style={styles.scoreTeam} numberOfLines={1}>{name}</Text>
      <View style={styles.scoreNumber}><Text style={styles.scoreValue}>{score}</Text>{overs ? <Text style={styles.scoreOvers}>{overs}</Text> : null}</View>
    </View>
  );
}

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const match = useMemo(() => getSampleMatch(Array.isArray(id) ? id[0] : id), [id]);
  const [tab, setTab] = useState<DetailTab>("summary");
  const [inningsIndex, setInningsIndex] = useState(match?.currentInningsIndex ?? 0);
  const { savedIds, toggleSaved } = useFavorites();

  if (!match) {
    return <ScreenContainer className="bg-background"><View style={styles.missing}><MaterialIcons name="menu-book" size={30} color={CricketPalette.burgundy} /><Text style={styles.missingTitle}>This page isn’t in the sample book</Text><Text style={styles.muted}>No real match lookup is connected.</Text><Pressable onPress={() => router.back()} style={styles.backButton}><Text style={styles.backText}>Return to matches</Text></Pressable></View></ScreenContainer>;
  }
  const innings = match.innings[inningsIndex];
  const saved = savedIds.includes(match.id);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backCircle}><MaterialIcons name="arrow-back" size={19} color={CricketPalette.ink} /></Pressable>
          <View style={styles.headerCopy}><Text style={styles.headerKicker}>SCOREBOOK · SAMPLE</Text><Text style={styles.headerTitle}>Match details</Text></View>
          <Pressable onPress={() => toggleSaved(match.id)} accessibilityRole="button" accessibilityLabel={saved ? "Remove saved match" : "Save match"} style={styles.backCircle}><MaterialIcons name={saved ? "bookmark" : "bookmark-border"} size={20} color={CricketPalette.burgundy} /></Pressable>
        </View>
        <SampleNotice />
        <View style={styles.matchIntro}>
          <Text style={styles.competition}>{match.competition}</Text>
          <View style={styles.metaRow}><Text style={styles.format}>{match.format}</Text><Text style={styles.metaDot}>·</Text><Text style={styles.venue} numberOfLines={1}>{match.venue}</Text></View>
        </View>
        <View style={styles.matchCard}>
          <View style={styles.matchCardTop}><Text style={styles.matchStatus}>{match.statusLabel.toUpperCase()}</Text><Text style={styles.sampleMatchId}>ILLUSTRATIVE MATCH</Text></View>
          <ScoreLine name={match.teamA.name} short={match.teamA.shortName} score={match.teamA.score} overs={match.teamA.overs} />
          <View style={styles.scoreRule}><View style={styles.scoreRuleGold} /></View>
          <ScoreLine name={match.teamB.name} short={match.teamB.shortName} score={match.teamB.score} overs={match.teamB.overs} accent />
          {match.target ? <View style={styles.chaseBox}>
            <View style={styles.chaseMain}><Text style={styles.chaseCaption}>SAMPLE CHASE</Text><Text style={styles.chaseValue}>{match.requiredRuns} to win</Text><Text style={styles.chaseCaption}>from {match.ballsRemaining} balls · target {match.target}</Text></View>
            <View style={styles.rateColumn}><Text style={styles.rateLabel}>CRR</Text><Text style={styles.rate}>{match.currentRunRate}</Text><Text style={styles.rateLabel}>RRR</Text><Text style={styles.rate}>{match.requiredRunRate}</Text></View>
          </View> : null}
          {match.result ? <View style={styles.resultBox}><MaterialIcons name="verified" size={15} color={CricketPalette.green} /><Text style={styles.resultText}>{match.result}</Text></View> : null}
          {match.status === "upcoming" ? <View style={styles.upcomingBox}><MaterialIcons name="schedule" size={16} color={CricketPalette.burgundy} /><Text style={styles.upcomingText}>This sample fixture has not started. No live schedule is connected.</Text></View> : null}
          <Text style={styles.toss}>{match.toss}</Text>
        </View>
        <View style={styles.tabRail}>
          {detailTabs.map((item) => {
            const selected = tab === item.key;
            return <Pressable key={item.key} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => setTab(item.key)} style={[styles.detailTab, selected && styles.detailTabSelected]}><MaterialIcons name={item.icon} size={15} color={selected ? CricketPalette.burgundy : CricketPalette.mutedInk} /><Text style={[styles.detailTabText, selected && styles.detailTabTextSelected]}>{item.label}</Text></Pressable>;
          })}
        </View>

        {tab === "summary" ? <View style={styles.contentSection}>
          <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>The state of play</Text><Text style={styles.sectionSubtitle}>A snapshot from the sample scorebook</Text></View><MaterialIcons name="auto-stories" size={21} color={CricketPalette.gold} /></View>
          {innings ? <>
            <View style={styles.summaryPanel}>
              <Text style={styles.summaryLabel}>CURRENT SAMPLE INNINGS</Text>
              <View style={styles.summaryLine}><Text style={styles.summaryTeam}>{innings.battingTeam}</Text><Text style={styles.summaryScore}>{innings.score}</Text></View>
              <Text style={styles.summaryOvers}>{innings.overs} overs · {innings.totalRuns} runs · {innings.wickets} wickets</Text>
            </View>
            <View style={styles.overPanel}><Text style={styles.overKicker}>MOST RECENT SAMPLE OVER</Text><Text style={styles.overSummary}>{innings.overSummary}</Text><View style={styles.ballRow}>{innings.deliveries.slice(-6).map((delivery, index) => <View key={`${delivery.over}-${index}`} style={[styles.ballPill, delivery.kind === "wicket" && styles.ballPillWicket, delivery.kind === "boundary" && styles.ballPillBoundary]}><Text style={[styles.ballPillText, delivery.kind === "wicket" && styles.ballPillTextWicket]}>{delivery.result}</Text></View>)}</View></View>
          </> : <View style={styles.noInnings}><Text style={styles.summaryLabel}>NO SAMPLE INNINGS YET</Text><Text style={styles.muted}>The fictional fixture is scheduled to begin later.</Text></View>}
          <Text style={styles.disclaimer}>Sample-only app preview. Status and scores do not reflect a real cricket match.</Text>
        </View> : null}

        {tab === "scorecard" ? <View style={styles.contentSection}>
          <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>The scorebook</Text><Text style={styles.sectionSubtitle}>Batting, bowling, extras & wickets</Text></View><MaterialIcons name="table-chart" size={20} color={CricketPalette.burgundy} /></View>
          {match.innings.length ? <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inningsPills}>
              {match.innings.map((entry, index) => <Pressable key={entry.id} onPress={() => setInningsIndex(index)} style={[styles.inningsPill, inningsIndex === index && styles.inningsPillSelected]}><Text style={[styles.inningsPillText, inningsIndex === index && styles.inningsPillTextSelected]}>{entry.battingTeam}</Text></Pressable>)}
            </ScrollView>
            {innings ? <InningsScorecard innings={innings} /> : null}
          </> : <View style={styles.noInnings}><MaterialIcons name="table-chart" size={21} color={CricketPalette.burgundy} /><Text style={styles.noInningsTitle}>Scorecard not started</Text><Text style={styles.muted}>This sample match has no innings yet. It is not a live fixture.</Text></View>}
        </View> : null}

        {tab === "commentary" ? <View style={styles.contentSection}>
          <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Every delivery</Text><Text style={styles.sectionSubtitle}>Fictional ball-by-ball commentary</Text></View><MaterialIcons name="forum" size={20} color={CricketPalette.burgundy} /></View>
          {innings ? <CommentaryTimeline innings={innings} /> : <View style={styles.noInnings}><MaterialIcons name="forum" size={21} color={CricketPalette.burgundy} /><Text style={styles.noInningsTitle}>No sample deliveries</Text><Text style={styles.muted}>This fixture has not started in the sample dataset.</Text></View>}
        </View> : null}

        <View style={styles.bottomNotice}><MaterialIcons name="info-outline" size={15} color={CricketPalette.burgundy} /><Text style={styles.bottomNoticeText}>No live score provider is connected. All details above are sample data.</Text></View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: { maxWidth: 720, width: "100%", alignSelf: "center", paddingHorizontal: 16, paddingTop: 7, paddingBottom: 30, gap: 13 },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  backCircle: { width: 37, height: 37, borderRadius: 19, backgroundColor: CricketPalette.sheet, borderWidth: 1, borderColor: CricketPalette.rule, alignItems: "center", justifyContent: "center" },
  headerCopy: { flex: 1 },
  headerKicker: { color: CricketPalette.burgundy, fontSize: 8, fontWeight: "800", letterSpacing: 1.2 },
  headerTitle: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 20, marginTop: 1 },
  matchIntro: { gap: 5, paddingTop: 1 },
  competition: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 19 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  format: { color: CricketPalette.burgundy, fontSize: 8, fontWeight: "800", letterSpacing: 0.7 },
  metaDot: { color: CricketPalette.mutedInk },
  venue: { color: CricketPalette.mutedInk, fontSize: 10, flexShrink: 1 },
  matchCard: { backgroundColor: CricketPalette.sheet, borderRadius: 16, borderWidth: 1, borderColor: CricketPalette.rule, padding: 15, shadowColor: "#554735", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  matchCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  matchStatus: { color: CricketPalette.burgundy, fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  sampleMatchId: { color: CricketPalette.mutedInk, fontSize: 7, fontWeight: "800", letterSpacing: 0.75 },
  scoreLine: { minHeight: 53, flexDirection: "row", alignItems: "center", gap: 9 },
  teamInitial: { width: 31, height: 31, borderRadius: 16, backgroundColor: "#E8DED0", alignItems: "center", justifyContent: "center" },
  teamInitialAccent: { backgroundColor: "#F1E8CD" },
  teamInitialText: { color: CricketPalette.burgundy, fontSize: 11, fontWeight: "900" },
  teamInitialTextAccent: { color: "#7A682E" },
  scoreTeam: { flex: 1, color: CricketPalette.ink, fontSize: 12, fontWeight: "700" },
  scoreNumber: { alignItems: "flex-end", minWidth: 82 },
  scoreValue: { color: CricketPalette.ink, fontFamily: CricketType.mono, fontSize: 16, fontWeight: "800" },
  scoreOvers: { color: CricketPalette.mutedInk, fontSize: 9, marginTop: 1 },
  scoreRule: { height: 1, backgroundColor: CricketPalette.rule, marginLeft: 40, marginVertical: 1 },
  scoreRuleGold: { width: 35, height: 2, backgroundColor: CricketPalette.gold, marginTop: -1 },
  chaseBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F4EAD7", borderRadius: 10, padding: 11, marginTop: 9 },
  chaseMain: { flex: 1 },
  chaseCaption: { color: CricketPalette.burgundy, fontSize: 8, fontWeight: "800", letterSpacing: 0.75 },
  chaseValue: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 22, marginVertical: 1 },
  rateColumn: { flexDirection: "row", alignItems: "center", gap: 5, borderLeftWidth: 1, borderLeftColor: "#D9CBAA", paddingLeft: 11, flexWrap: "wrap", width: 92 },
  rateLabel: { color: CricketPalette.mutedInk, fontSize: 7, fontWeight: "800" },
  rate: { width: 31, color: CricketPalette.burgundyDeep, fontFamily: CricketType.mono, fontSize: 10, fontWeight: "800" },
  resultBox: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 9, padding: 9, borderRadius: 8, backgroundColor: CricketPalette.softGreen },
  resultText: { color: CricketPalette.green, fontSize: 11, fontWeight: "800" },
  upcomingBox: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 9, backgroundColor: "#F5F0E6", padding: 9, borderRadius: 8 },
  upcomingText: { flex: 1, color: CricketPalette.mutedInk, fontSize: 10, lineHeight: 15 },
  toss: { borderTopWidth: 1, borderTopColor: "#EEE8DC", color: CricketPalette.mutedInk, fontSize: 9, lineHeight: 14, marginTop: 10, paddingTop: 8 },
  tabRail: { flexDirection: "row", gap: 3, padding: 4, borderRadius: 11, backgroundColor: "#EAE5DA" },
  detailTab: { flex: 1, minHeight: 39, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 8, paddingHorizontal: 5 },
  detailTabSelected: { backgroundColor: CricketPalette.sheet },
  detailTabText: { color: CricketPalette.mutedInk, fontSize: 9, fontWeight: "700" },
  detailTabTextSelected: { color: CricketPalette.burgundy, fontWeight: "800" },
  contentSection: { gap: 10 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 2 },
  sectionTitle: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 21 },
  sectionSubtitle: { color: CricketPalette.mutedInk, fontSize: 9, marginTop: 2 },
  summaryPanel: { backgroundColor: CricketPalette.sheet, borderWidth: 1, borderColor: CricketPalette.rule, borderRadius: 13, padding: 13 },
  summaryLabel: { color: CricketPalette.burgundy, fontSize: 8, fontWeight: "800", letterSpacing: 0.95 },
  summaryLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 7 },
  summaryTeam: { flex: 1, color: CricketPalette.ink, fontSize: 12, fontWeight: "700" },
  summaryScore: { color: CricketPalette.burgundyDeep, fontFamily: CricketType.mono, fontSize: 17, fontWeight: "800" },
  summaryOvers: { color: CricketPalette.mutedInk, fontSize: 10, marginTop: 3 },
  overPanel: { backgroundColor: "#FBF7ED", borderWidth: 1, borderColor: CricketPalette.rule, borderRadius: 13, padding: 12 },
  overKicker: { color: CricketPalette.mutedInk, fontSize: 8, fontWeight: "800", letterSpacing: 0.9 },
  overSummary: { color: CricketPalette.ink, fontSize: 11, fontWeight: "700", marginTop: 3 },
  ballRow: { flexDirection: "row", gap: 6, marginTop: 10 },
  ballPill: { minWidth: 27, height: 27, paddingHorizontal: 5, alignItems: "center", justifyContent: "center", backgroundColor: "#EBE5D9", borderRadius: 14 },
  ballPillWicket: { backgroundColor: CricketPalette.burgundy },
  ballPillBoundary: { backgroundColor: CricketPalette.softGold },
  ballPillText: { color: CricketPalette.ink, fontFamily: CricketType.mono, fontSize: 9, fontWeight: "800" },
  ballPillTextWicket: { color: CricketPalette.sheet },
  disclaimer: { color: CricketPalette.mutedInk, fontSize: 9, lineHeight: 14, textAlign: "center", marginTop: 1 },
  inningsPills: { gap: 6, paddingBottom: 2 },
  inningsPill: { paddingHorizontal: 10, paddingVertical: 7, backgroundColor: "#EAE5DA", borderRadius: 18 },
  inningsPillSelected: { backgroundColor: CricketPalette.burgundy },
  inningsPillText: { color: CricketPalette.mutedInk, fontSize: 9, fontWeight: "700" },
  inningsPillTextSelected: { color: CricketPalette.sheet },
  noInnings: { alignItems: "center", justifyContent: "center", padding: 25, gap: 9, backgroundColor: CricketPalette.sheet, borderRadius: 14, borderWidth: 1, borderColor: CricketPalette.rule },
  noInningsTitle: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 18 },
  muted: { color: CricketPalette.mutedInk, fontSize: 10, lineHeight: 15, textAlign: "center" },
  bottomNotice: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderTopWidth: 1, borderTopColor: CricketPalette.rule, paddingTop: 10 },
  bottomNoticeText: { color: CricketPalette.burgundy, fontSize: 9, fontWeight: "700", textAlign: "center", flexShrink: 1 },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", padding: 22, gap: 9 },
  missingTitle: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 22, textAlign: "center" },
  backButton: { backgroundColor: CricketPalette.burgundy, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginTop: 6 },
  backText: { color: CricketPalette.sheet, fontSize: 11, fontWeight: "800" },
});
