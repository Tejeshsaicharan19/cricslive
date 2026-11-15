import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { CricketPalette, CricketType } from "@/constants/cricket-design";

export function SampleNotice({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.wrap, compact && styles.compact]} accessibilityRole="text">
      <View style={styles.icon}>
        <MaterialIcons name="info-outline" size={15} color={CricketPalette.burgundy} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>SAMPLE DATA · NOT LIVE</Text>
        {!compact ? <Text style={styles.subtitle}>Fictional fixtures for preview only. No live scores are connected.</Text> : null}
      </View>
      <View style={styles.sampleStamp}>
        <Text style={styles.stampText}>DEMO</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: CricketPalette.softGold,
    borderColor: "#D9C786",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  compact: { paddingVertical: 8 },
  icon: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#FBF5DE",
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1 },
  title: { color: CricketPalette.burgundyDeep, fontFamily: CricketType.body, fontSize: 11, fontWeight: "800", letterSpacing: 0.9 },
  subtitle: { color: "#655B47", fontFamily: CricketType.body, fontSize: 11, lineHeight: 16, marginTop: 2 },
  sampleStamp: { borderWidth: 1, borderColor: "#C9B368", paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5, transform: [{ rotate: "-4deg" }] },
  stampText: { color: CricketPalette.burgundy, fontSize: 9, fontWeight: "800", letterSpacing: 1.1 },
});
