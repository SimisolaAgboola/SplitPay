import { StyleSheet, Text, View } from "react-native";

type Participant = {
  name: string;
  paid: boolean;
};

type FinancialCardProps = {
  total: number;
  paid: number;
  participants: Participant[];
  currency?: string;
};

export default function FinancialCard({
  total,
  paid,
  participants,
  currency = "₦",
}: FinancialCardProps) {
  const outstanding = total - paid;

  return (
    <View style={styles.card}>
      {/* Amount summary */}
      <View style={styles.row}>
        <Text style={styles.label}>Total Amount</Text>
        <Text style={styles.value}>
          {currency}
          {total.toLocaleString()}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Paid</Text>
        <Text style={[styles.value, styles.paid]}>
          {currency}
          {paid.toLocaleString()}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Outstanding</Text>
        <Text style={[styles.value, styles.outstanding]}>
          {currency}
          {outstanding.toLocaleString()}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Participants */}
      <Text style={styles.sectionTitle}>Participants</Text>

      {participants.map((person) => (
        <View key={person.name} style={styles.participantRow}>
          <Text style={styles.participantName}>{person.name}</Text>
          <Text
            style={[
              styles.status,
              person.paid ? styles.statusPaid : styles.statusUnpaid,
            ]}
          >
            {person.paid ? "✅ Paid" : "❌ Unpaid"}
          </Text>
        </View>
      ))}
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
    marginBottom: 6,
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

  paid: {
    color: "#0F8A4B",
  },

  outstanding: {
    color: "#C0392B",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
  },

  participantRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  participantName: {
    fontSize: 14,
    color: "#111",
  },

  status: {
    fontSize: 13,
    fontWeight: "500",
  },

  statusPaid: {
    color: "#0F8A4B",
  },

  statusUnpaid: {
    color: "#C0392B",
  },
});

