import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { Innings } from "@/types/cricket";
import { CricketPalette, CricketType } from "@/constants/cricket-design";

function economyRate(runs: number, overs: string) {
  const [completedOvers, ballsInProgress = 0] = overs.split(".").map(Number);
  const legalBalls = completedOvers * 6 + ballsInProgress;
  return legalBalls === 0 ? "—" : ((runs * 6) / legalBalls).toFixed(1);
}

export function InningsScorecard({ innings }: { innings: Innings }) {
  return (
    <View style={styles.card}>
      <View style={styles.inningsHead}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>SAMPLE INNINGS</Text>
          <Text style={styles.team}>{innings.battingTeam}</Text>
        </View>
        <View style={styles.totalBlock}><Text style={styles.total}>{innings.score}</Text><Text style={styles.overs}>{innings.overs} overs</Text></View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.nameCell, styles.header]}>BATTER</Text>
            <Text style={[styles.cell, styles.header, styles.stat]}>R</Text><Text style={[styles.cell, styles.header, styles.stat]}>B</Text>
            <Text style={[styles.cell, styles.header, styles.stat]}>4s</Text><Text style={[styles.cell, styles.header, styles.stat]}>6s</Text>
            <Text style={[styles.cell, styles.header, styles.stat]}>SR</Text>
          </View>
          {innings.batters.map((batter) => (
            <View key={batter.name} style={styles.row}>
              <View style={[styles.cell, styles.nameCell]}><Text style={styles.player}>{batter.name}</Text><Text style={styles.dismissal}>{batter.dismissal}</Text></View>
              <Text style={[styles.cell, styles.stat, styles.number]}>{batter.runs}</Text><Text style={[styles.cell, styles.stat]}>{batter.balls || "—"}</Text>
              <Text style={[styles.cell, styles.stat]}>{batter.fours || "—"}</Text><Text style={[styles.cell, styles.stat]}>{batter.sixes || "—"}</Text>
              <Text style={[styles.cell, styles.stat]}>{batter.balls ? ((batter.runs / batter.balls) * 100).toFixed(1) : "—"}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.extras}><Text style={styles.extrasLabel}>EXTRAS</Text><Text style={styles.extrasText}>{innings.extras}</Text></View>
      <View style={styles.rule} />
      <Text style={styles.sectionTitle}>Bowling</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.nameCell, styles.header]}>BOWLER</Text><Text style={[styles.cell, styles.header, styles.stat]}>O</Text>
            <Text style={[styles.cell, styles.header, styles.stat]}>M</Text><Text style={[styles.cell, styles.header, styles.stat]}>R</Text>
            <Text style={[styles.cell, styles.header, styles.stat]}>W</Text><Text style={[styles.cell, styles.header, styles.stat]}>ECON</Text>
          </View>
          {innings.bowlers.map((bowler) => (
            <View key={bowler.name} style={styles.row}>
              <Text style={[styles.cell, styles.nameCell, styles.player]}>{bowler.name}</Text><Text style={[styles.cell, styles.stat]}>{bowler.overs}</Text>
              <Text style={[styles.cell, styles.stat]}>{bowler.maidens}</Text><Text style={[styles.cell, styles.stat]}>{bowler.runs}</Text>
              <Text style={[styles.cell, styles.stat, styles.number]}>{bowler.wickets}</Text><Text style={[styles.cell, styles.stat]}>{economyRate(bowler.runs, bowler.overs)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.fowBlock}>
        <Text style={styles.sectionTitle}>Fall of wickets</Text>
        <Text style={styles.fow}>{innings.fallOfWickets.length ? innings.fallOfWickets.join("   ·   ") : "No sample wickets recorded."}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: CricketPalette.sheet, borderWidth: 1, borderColor: CricketPalette.rule, borderRadius: 14, padding: 14, gap: 8 },
  inningsHead: { flexDirection: "row", alignItems: "center", paddingBottom: 5 },
  kicker: { color: CricketPalette.burgundy, fontSize: 8, fontWeight: "800", letterSpacing: 1.2 },
  team: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 19, marginTop: 2 },
  totalBlock: { alignItems: "flex-end" },
  total: { color: CricketPalette.burgundyDeep, fontFamily: CricketType.mono, fontSize: 17, fontWeight: "800" },
  overs: { color: CricketPalette.mutedInk, fontSize: 9, marginTop: 1 },
  table: { minWidth: 390 },
  row: { flexDirection: "row", alignItems: "center", minHeight: 39, borderBottomWidth: 1, borderBottomColor: "#EEE8DC" },
  headerRow: { minHeight: 27, backgroundColor: "#F8F4EB" },
  cell: { color: CricketPalette.mutedInk, fontSize: 10, paddingHorizontal: 5, textAlign: "right" },
  nameCell: { width: 153, textAlign: "left", paddingLeft: 5 },
  stat: { width: 42, fontFamily: CricketType.mono, fontVariant: ["tabular-nums"] },
  header: { color: CricketPalette.mutedInk, fontSize: 8, fontWeight: "800", letterSpacing: 0.6 },
  player: { color: CricketPalette.ink, fontSize: 11, fontWeight: "700", textAlign: "left" },
  dismissal: { color: CricketPalette.mutedInk, fontSize: 9, marginTop: 1 },
  number: { color: CricketPalette.burgundyDeep, fontWeight: "800" },
  extras: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 5, paddingTop: 4 },
  extrasLabel: { color: CricketPalette.mutedInk, fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  extrasText: { color: CricketPalette.ink, fontSize: 10, fontWeight: "700" },
  rule: { height: 1, backgroundColor: CricketPalette.rule, marginVertical: 3 },
  sectionTitle: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 16 },
  fowBlock: { gap: 5, marginTop: 4 },
  fow: { color: CricketPalette.mutedInk, fontSize: 10, lineHeight: 17 },
});
