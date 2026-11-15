import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MatchCard } from "@/components/cricket/MatchCard";
import { SampleNotice } from "@/components/cricket/SampleNotice";
import { ScreenContainer } from "@/components/screen-container";
import { CricketPalette, CricketType } from "@/constants/cricket-design";
import { sampleMatches } from "@/data/sampleMatches";
import { useFavorites } from "@/lib/favorites";
import type { MatchFilter } from "@/types/cricket";

type PreviewState = "sample" | "loading" | "stale" | "empty" | "offline";
const filters: { key: MatchFilter; label: string }[] = [
  { key: "all", label: "All matches" }, { key: "in_progress", label: "In play" },
  { key: "upcoming", label: "Upcoming" }, { key: "completed", label: "Results" },
];
const stateChoices: { key: PreviewState; label: string }[] = [
  { key: "sample", label: "Sample" }, { key: "loading", label: "Loading" },
  { key: "stale", label: "Stale" }, { key: "empty", label: "Empty" }, { key: "offline", label: "Offline" },
];

function DemonstrationState({ state }: { state: PreviewState }) {
  if (state === "sample") return null;
  const content = {
    loading: { icon: "hourglass-top" as const, title: "Loading preview state", body: "A static example of a loading screen. No score feed is being requested." },
    stale: { icon: "history" as const, title: "Sample snapshot · not live", body: "These fictional scores are not refreshing and may not reflect any real match." },
    empty: { icon: "sports-cricket" as const, title: "No sample fixtures here", body: "This empty state is part of the interface preview, not a real fixture search." },
    offline: { icon: "cloud-off" as const, title: "No live connection in this demo", body: "A cricket data provider has not been connected. This app contains sample content only." },
    sample: { icon: "info-outline" as const, title: "Sample state", body: "Fictional preview data." },
  }[state];
  return (
    <View style={styles.stateCard} accessibilityRole="summary">
      <View style={styles.stateIcon}><MaterialIcons name={content.icon} size={19} color={CricketPalette.burgundy} /></View>
      <View style={styles.stateCopy}>
        <Text style={styles.stateLabel}>UI STATE PREVIEW · NOT LIVE</Text>
        <Text style={styles.stateTitle}>{content.title}</Text>
        <Text style={styles.stateBody}>{content.body}</Text>
      </View>
    </View>
  );
}

export default function MatchesScreen() {
  const [filter, setFilter] = useState<MatchFilter>("all");
  const [previewState, setPreviewState] = useState<PreviewState>("sample");
  const { savedIds, toggleSaved } = useFavorites();
  const filteredMatches = useMemo(() => filter === "all" ? sampleMatches : sampleMatches.filter((match) => match.status === filter), [filter]);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><MaterialIcons name="menu-book" size={20} color={CricketPalette.sheet} /></View>
          <View style={styles.brandCopy}><Text style={styles.brandName}>SCOREBOOK</Text><Text style={styles.brandSub}>CRICKET, KEPT CLEAR</Text></View>
          <View style={styles.issueStamp}><Text style={styles.issueStampText}>ISSUE 01</Text></View>
        </View>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>THE CRICKET DAY</Text>
          <Text style={styles.headline}>Follow every{`\n`}innings.</Text>
          <Text style={styles.intro}>A considered little scorebook for the moments that move a match.</Text>
        </View>
        <SampleNotice />
        <View style={styles.sectionHead}>
          <View><Text style={styles.sectionTitle}>Matches in the book</Text><Text style={styles.sectionSub}>FICTIONAL FIXTURES FOR APP PREVIEW</Text></View>
          <Text style={styles.count}>{filteredMatches.length.toString().padStart(2, "0")}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((item) => {
            const selected = item.key === filter;
            return <Pressable key={item.key} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => setFilter(item.key)} style={[styles.filterChip, selected && styles.filterChipSelected]}><Text style={[styles.filterText, selected && styles.filterTextSelected]}>{item.label}</Text></Pressable>;
          })}
        </ScrollView>
        <View style={styles.previewStates}>
          <Text style={styles.previewLabel}>PREVIEW UI STATES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stateChipRow}>
            {stateChoices.map((item) => {
              const selected = item.key === previewState;
              return <Pressable key={item.key} onPress={() => setPreviewState(item.key)} accessibilityRole="button" accessibilityState={{ selected }} style={[styles.stateChip, selected && styles.stateChipSelected]}><Text style={[styles.stateChipText, selected && styles.stateChipTextSelected]}>{item.label}</Text></Pressable>;
            })}
          </ScrollView>
        </View>
        <DemonstrationState state={previewState} />
        {previewState === "sample" || previewState === "stale" ? filteredMatches.map((match) => (
          <MatchCard key={match.id} match={match} saved={savedIds.includes(match.id)} onPress={() => router.push({ pathname: "/match/[id]", params: { id: match.id } })} onToggleSaved={() => toggleSaved(match.id)} />
        )) : null}
        {previewState === "sample" && filteredMatches.length === 0 ? <View style={styles.emptyCard}><MaterialIcons name="sports-cricket" size={26} color={CricketPalette.burgundy} /><Text style={styles.emptyTitle}>No sample matches in this section</Text><Text style={styles.emptyBody}>Choose another filter to browse the fictional preview fixtures.</Text></View> : null}
        <View style={styles.endnote}><MaterialIcons name="menu-book" size={15} color={CricketPalette.mutedInk} /><Text style={styles.endnoteText}>Names, scores, venues, and results on this screen are illustrative samples.</Text></View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 28, gap: 14, maxWidth: 720, width: "100%", alignSelf: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 3 },
  brandMark: { width: 38, height: 38, backgroundColor: CricketPalette.burgundy, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  brandCopy: { flex: 1 },
  brandName: { color: CricketPalette.burgundyDeep, fontSize: 13, fontWeight: "900", letterSpacing: 1.8 },
  brandSub: { color: CricketPalette.mutedInk, fontSize: 8, fontWeight: "700", letterSpacing: 1.3, marginTop: 2 },
  issueStamp: { paddingHorizontal: 8, paddingVertical: 5, borderWidth: 1, borderColor: "#C9BFAF", borderRadius: 4 },
  issueStampText: { fontSize: 8, color: CricketPalette.mutedInk, fontWeight: "800", letterSpacing: 1 },
  hero: { paddingTop: 4, paddingBottom: 1 },
  eyebrow: { color: CricketPalette.burgundy, fontSize: 10, fontWeight: "800", letterSpacing: 2.2, marginBottom: 7 },
  headline: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 36, lineHeight: 39, letterSpacing: -0.8 },
  intro: { color: CricketPalette.mutedInk, fontSize: 13, lineHeight: 19, maxWidth: 300, marginTop: 7 },
  sectionHead: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 4, marginBottom: -5 },
  sectionTitle: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 22 },
  sectionSub: { color: CricketPalette.mutedInk, fontSize: 8, fontWeight: "800", letterSpacing: 1, marginTop: 3 },
  count: { color: CricketPalette.burgundy, fontFamily: CricketType.mono, fontSize: 17, fontWeight: "700" },
  filterRow: { gap: 7, paddingVertical: 4 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: CricketPalette.rule, backgroundColor: "#F9F6F0" },
  filterChipSelected: { backgroundColor: CricketPalette.burgundy, borderColor: CricketPalette.burgundy },
  filterText: { color: CricketPalette.mutedInk, fontSize: 11, fontWeight: "700" },
  filterTextSelected: { color: CricketPalette.sheet },
  previewStates: { borderTopWidth: 1, borderTopColor: CricketPalette.rule, paddingTop: 9, marginTop: -3, gap: 5 },
  previewLabel: { color: CricketPalette.mutedInk, fontSize: 8, fontWeight: "800", letterSpacing: 1.25 },
  stateChipRow: { gap: 6 },
  stateChip: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12, backgroundColor: "#EAE5DA" },
  stateChipSelected: { backgroundColor: CricketPalette.softGold },
  stateChipText: { color: CricketPalette.mutedInk, fontSize: 9, fontWeight: "700" },
  stateChipTextSelected: { color: CricketPalette.burgundyDeep },
  stateCard: { flexDirection: "row", gap: 10, padding: 13, borderRadius: 12, backgroundColor: CricketPalette.sheet, borderWidth: 1, borderColor: CricketPalette.rule },
  stateIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: CricketPalette.softRose, alignItems: "center", justifyContent: "center" },
  stateCopy: { flex: 1 },
  stateLabel: { fontSize: 8, color: CricketPalette.burgundy, fontWeight: "800", letterSpacing: 0.9 },
  stateTitle: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 17, marginTop: 3 },
  stateBody: { color: CricketPalette.mutedInk, fontSize: 11, lineHeight: 16, marginTop: 2 },
  emptyCard: { borderStyle: "dashed", borderWidth: 1, borderColor: CricketPalette.rule, borderRadius: 14, padding: 20, alignItems: "center", gap: 8, backgroundColor: "#FAF7F0" },
  emptyTitle: { fontFamily: CricketType.display, color: CricketPalette.ink, fontSize: 18 },
  emptyBody: { color: CricketPalette.mutedInk, fontSize: 11, textAlign: "center", lineHeight: 16 },
  endnote: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingTop: 3 },
  endnoteText: { color: CricketPalette.mutedInk, fontSize: 9, textAlign: "center", flexShrink: 1 },
});
