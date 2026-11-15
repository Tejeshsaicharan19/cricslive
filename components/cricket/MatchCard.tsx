import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CricketMatch } from "@/types/cricket";
import { CricketPalette, CricketType } from "@/constants/cricket-design";

function statusTone(status: CricketMatch["status"]) {
  if (status === "in_progress") return { background: "#F1E7D4", color: CricketPalette.burgundyDeep, icon: "sports-cricket" as const };
  if (status === "completed") return { background: CricketPalette.softGreen, color: CricketPalette.green, icon: "check-circle-outline" as const };
  return { background: "#EEEAE2", color: CricketPalette.mutedInk, icon: "schedule" as const };
}

export function MatchCard({ match, saved, onPress, onToggleSaved }: {
  match: CricketMatch;
  saved: boolean;
  onPress: () => void;
  onToggleSaved: () => void;
}) {
  const tone = statusTone(match.status);
  return (
    <View style={styles.card}>
      <View style={styles.topLine}>
        <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${match.teamA.name} versus ${match.teamB.name}, sample data, not live`} style={styles.competitionLine}>
          <View style={styles.tinyRule} />
          <Text style={styles.competition} numberOfLines={1}>{match.competition}</Text>
        </Pressable>
        <Pressable onPress={(event) => { event.stopPropagation(); onToggleSaved(); }} accessibilityRole="button" accessibilityLabel={saved ? "Remove from saved matches" : "Save match"} hitSlop={10} style={styles.saveButton}>
          <MaterialIcons name={saved ? "bookmark" : "bookmark-border"} size={20} color={saved ? CricketPalette.burgundy : CricketPalette.mutedInk} />
        </Pressable>
      </View>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${match.teamA.name} versus ${match.teamB.name}, open sample match, not live`} style={({ pressed }) => pressed && styles.pressed}>
        <View style={styles.metaRow}>
          <Text style={styles.format}>{match.format}</Text>
          <View style={[styles.statusPill, { backgroundColor: tone.background }]}>
            <MaterialIcons name={tone.icon} size={12} color={tone.color} />
            <Text style={[styles.statusText, { color: tone.color }]}>{match.statusLabel.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.teams}>
          <View style={styles.teamRow}>
            <View style={styles.crest}><Text style={styles.crestText}>{match.teamA.shortName.slice(0, 1)}</Text></View>
            <Text style={styles.teamName} numberOfLines={1}>{match.teamA.name}</Text>
            <View style={styles.scoreBlock}>
              <Text style={styles.score}>{match.teamA.score}</Text>
              {!!match.teamA.overs && <Text style={styles.overs}>{match.teamA.overs}</Text>}
            </View>
          </View>
          <View style={styles.teamRow}>
            <View style={[styles.crest, styles.crestSecond]}><Text style={[styles.crestText, styles.crestTextSecond]}>{match.teamB.shortName.slice(0, 1)}</Text></View>
            <Text style={styles.teamName} numberOfLines={1}>{match.teamB.name}</Text>
            <View style={styles.scoreBlock}>
              <Text style={styles.score}>{match.teamB.score}</Text>
              {!!match.teamB.overs && <Text style={styles.overs}>{match.teamB.overs}</Text>}
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerLocation}>
            <MaterialIcons name="location-on" size={13} color={CricketPalette.mutedInk} />
            <Text style={styles.venue} numberOfLines={1}>{match.venue}</Text>
          </View>
          <Text style={styles.notLive}>SAMPLE · NOT LIVE</Text>
        </View>
        {match.result ? <Text style={styles.result}>{match.result}</Text> : null}
        {match.target ? <Text style={styles.chase}>{match.requiredRuns} runs · {match.ballsRemaining} balls · target {match.target}</Text> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: CricketPalette.sheet, borderRadius: 16, borderWidth: 1, borderColor: CricketPalette.rule, padding: 15, marginBottom: 12, shadowColor: "#554735", shadowOpacity: 0.055, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  topLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  competitionLine: { flexDirection: "row", alignItems: "center", gap: 7, flex: 1, marginRight: 6 },
  tinyRule: { width: 16, height: 2, backgroundColor: CricketPalette.gold, borderRadius: 2 },
  competition: { color: CricketPalette.ink, fontSize: 12, fontWeight: "700", flexShrink: 1 },
  saveButton: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 16 },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 3, marginBottom: 12 },
  format: { color: CricketPalette.mutedInk, fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 20, paddingHorizontal: 7, paddingVertical: 4 },
  statusText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.55 },
  teams: { gap: 9 },
  teamRow: { flexDirection: "row", alignItems: "center", minHeight: 34 },
  crest: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#E8DED0", alignItems: "center", justifyContent: "center", marginRight: 9 },
  crestSecond: { backgroundColor: "#E9E4D8" },
  crestText: { color: CricketPalette.burgundyDeep, fontSize: 10, fontWeight: "800" },
  crestTextSecond: { color: "#665B4B" },
  teamName: { flex: 1, color: CricketPalette.ink, fontSize: 14, fontWeight: "600" },
  scoreBlock: { alignItems: "flex-end", minWidth: 86 },
  score: { color: CricketPalette.ink, fontFamily: CricketType.mono, fontSize: 14, fontWeight: "700", fontVariant: ["tabular-nums"] },
  overs: { color: CricketPalette.mutedInk, fontSize: 10, marginTop: 1 },
  footer: { borderTopWidth: 1, borderTopColor: "#EEE8DC", marginTop: 11, paddingTop: 9, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  footerLocation: { flexDirection: "row", alignItems: "center", gap: 3, flex: 1 },
  venue: { color: CricketPalette.mutedInk, fontSize: 10, flexShrink: 1 },
  notLive: { color: CricketPalette.burgundy, fontSize: 8, fontWeight: "800", letterSpacing: 0.7 },
  result: { marginTop: 10, backgroundColor: CricketPalette.softGreen, borderRadius: 8, color: CricketPalette.green, paddingHorizontal: 10, paddingVertical: 7, fontSize: 11, fontWeight: "700" },
  chase: { color: CricketPalette.burgundyDeep, marginTop: 9, fontSize: 11, fontWeight: "700" },
});
