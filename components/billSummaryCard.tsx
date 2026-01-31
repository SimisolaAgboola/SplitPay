import { StyleSheet, Text, View } from "react-native";

type BillSummaryCardProps = {
  totalBill: number;
  numberOfPeople: number;
  yourShare: number;
  currency?: string;
};

export default function BillSummaryCard({
  totalBill,
  numberOfPeople,
  yourShare,
  currency = "₦",
}: BillSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Total Bill</Text>
        <Text style={styles.value}>
          {currency}
          {totalBill.toLocaleString()}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Number of People</Text>
        <Text style={styles.value}>{numberOfPeople}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.shareLabel}>Your Share</Text>
        <Text style={styles.shareValue}>
          {currency}
          {yourShare.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginVertical: 10,
    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    color: "#666",
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 12,
  },

  shareLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  shareValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F8A4B",
  },
});
