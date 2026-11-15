import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { MatchCard } from "@/components/cricket/MatchCard";
import { SampleNotice } from "@/components/cricket/SampleNotice";
import { CricketPalette, CricketType } from "@/constants/cricket-design";
import { sampleMatches } from "@/data/sampleMatches";
import { useFavorites } from "@/lib/favorites";

export default function SavedMatchesScreen() {
  const { savedIds, toggleSaved } = useFavorites();
  const saved = sampleMatches.filter((match) => savedIds.includes(match.id));
  return (
    <ScreenContainer safeAreaClassName="bg-background" className="bg-background">
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.kickerRow}>
          <MaterialIcons name="bookmark" size={16} color={CricketPalette.burgundy} />
          <Text style={styles.kicker}>YOUR MARKED PAGES</Text>
        </View>
        <Text style={styles.title}>Saved matches</Text>
        <Text style={styles.subtitle}>Keep a few sample scorecards close at hand.</Text>
        <SampleNotice />
        {saved.length ? saved.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            saved
            onPress={() => router.push({ pathname: "/match/[id]", params: { id: match.id } })}
            onToggleSaved={() => toggleSaved(match.id)}
          />
        )) : (
          <View style={styles.empty}>
            <View style={styles.emptyMark}><MaterialIcons name="bookmark-border" size={24} color={CricketPalette.burgundy} /></View>
            <Text style={styles.emptyTitle}>No saved pages yet</Text>
            <Text style={styles.emptyBody}>Tap the bookmark on a sample match to add it here. Your list stays on this screen for this app session only.</Text>
          </View>
        )}
        <Text style={styles.footnote}>Saved state is temporary and local to this preview.</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: { padding: 18, paddingTop: 20, paddingBottom: 30, gap: 14, maxWidth: 720, width: "100%", alignSelf: "center" },
  kickerRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  kicker: { color: CricketPalette.burgundy, fontSize: 9, fontWeight: "800", letterSpacing: 1.6 },
  title: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 32, marginTop: -7 },
  subtitle: { color: CricketPalette.mutedInk, fontSize: 12, marginTop: -11 },
  empty: { marginTop: 10, backgroundColor: CricketPalette.sheet, borderWidth: 1, borderColor: CricketPalette.rule, borderRadius: 16, alignItems: "center", padding: 23, gap: 9 },
  emptyMark: { width: 48, height: 48, borderRadius: 24, backgroundColor: CricketPalette.softGold, alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 21 },
  emptyBody: { color: CricketPalette.mutedInk, fontSize: 11, lineHeight: 17, textAlign: "center", maxWidth: 280 },
  footnote: { color: CricketPalette.mutedInk, fontSize: 9, textAlign: "center", marginTop: 2 },
});
