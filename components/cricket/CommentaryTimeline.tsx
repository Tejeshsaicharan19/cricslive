import { StyleSheet, Text, View } from "react-native";
import type { DeliveryEvent, Innings } from "@/types/cricket";
import { CricketPalette, CricketType } from "@/constants/cricket-design";

function eventColors(kind: DeliveryEvent["kind"]) {
  if (kind === "wicket") return { background: CricketPalette.burgundy, foreground: CricketPalette.sheet };
  if (kind === "boundary") return { background: CricketPalette.softGold, foreground: CricketPalette.burgundyDeep };
  if (kind === "extra") return { background: "#ECE7DD", foreground: CricketPalette.mutedInk };
  return { background: "#F3EFE7", foreground: CricketPalette.ink };
}

export function CommentaryTimeline({ innings }: { innings: Innings }) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View><Text style={styles.kicker}>BALL-BY-BALL · SAMPLE</Text><Text style={styles.title}>{innings.battingTeam}</Text></View>
        <Text style={styles.count}>{innings.deliveries.length} balls</Text>
      </View>
      <View style={styles.overBanner}><Text style={styles.overLabel}>OVER SUMMARY</Text><Text style={styles.overText}>{innings.overSummary}</Text></View>
      {innings.deliveries.map((delivery, index) => {
        const colors = eventColors(delivery.kind);
        const isFirst = index === 0;
        return (
          <View key={`${delivery.over}-${index}`} style={styles.deliveryRow}>
            <View style={styles.timeline}>
              <View style={[styles.timelineDot, isFirst && styles.timelineDotFirst]} />
              {index < innings.deliveries.length - 1 ? <View style={styles.timelineLine} /> : null}
            </View>
            <Text style={styles.ball}>{delivery.over}</Text>
            <View style={[styles.outcome, { backgroundColor: colors.background }]}><Text style={[styles.outcomeText, { color: colors.foreground }]}>{delivery.result}</Text></View>
            <View style={styles.deliveryCopy}><Text style={styles.note}>{delivery.note}</Text><Text style={styles.smallNote}>{delivery.kind === "wicket" ? "WICKET · SAMPLE EVENT" : delivery.kind === "extra" ? "EXTRA · SAMPLE EVENT" : delivery.kind === "boundary" ? "BOUNDARY · SAMPLE EVENT" : "SAMPLE DELIVERY"}</Text></View>
          </View>
        );
      })}
      <Text style={styles.disclaimer}>These commentary lines are fictional examples, not updates from a match.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: CricketPalette.sheet, borderWidth: 1, borderColor: CricketPalette.rule, borderRadius: 14, padding: 14 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 11 },
  kicker: { color: CricketPalette.burgundy, fontSize: 8, fontWeight: "800", letterSpacing: 1.1 },
  title: { color: CricketPalette.ink, fontFamily: CricketType.display, fontSize: 18, marginTop: 2 },
  count: { color: CricketPalette.mutedInk, fontSize: 9, fontWeight: "700" },
  overBanner: { padding: 9, borderRadius: 8, backgroundColor: "#F3EBD7", marginBottom: 4 },
  overLabel: { color: CricketPalette.burgundy, fontSize: 8, fontWeight: "800", letterSpacing: 0.8 },
  overText: { color: CricketPalette.ink, fontSize: 11, fontWeight: "700", marginTop: 2 },
  deliveryRow: { flexDirection: "row", alignItems: "flex-start", minHeight: 65, paddingTop: 10 },
  timeline: { width: 12, alignItems: "center", alignSelf: "stretch", marginRight: 8 },
  timelineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#B7AA96", marginTop: 4, zIndex: 1 },
  timelineDotFirst: { backgroundColor: CricketPalette.burgundy },
  timelineLine: { position: "absolute", top: 10, bottom: -10, width: 1, backgroundColor: CricketPalette.rule },
  ball: { color: CricketPalette.mutedInk, width: 38, fontFamily: CricketType.mono, fontSize: 10, paddingTop: 1 },
  outcome: { minWidth: 28, height: 25, paddingHorizontal: 5, borderRadius: 7, alignItems: "center", justifyContent: "center", marginRight: 9 },
  outcomeText: { fontFamily: CricketType.mono, fontSize: 10, fontWeight: "900" },
  deliveryCopy: { flex: 1 },
  note: { color: CricketPalette.ink, fontSize: 11, lineHeight: 16 },
  smallNote: { color: CricketPalette.mutedInk, fontSize: 7, fontWeight: "800", letterSpacing: 0.75, marginTop: 4 },
  disclaimer: { color: CricketPalette.mutedInk, fontSize: 9, lineHeight: 14, borderTopWidth: 1, borderTopColor: CricketPalette.rule, marginTop: 7, paddingTop: 9 },
});
