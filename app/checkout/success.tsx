import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Success Icon Badge */}
        <View style={styles.successIconOuter}>
          <View style={styles.successIconInner}>
            <Ionicons name="checkmark" size={48} color="#0A0F1D" />
          </View>
        </View>

        {/* Success Text Messaging */}
        <Text style={styles.title}>Payment Successful! 🎉</Text>
        <Text style={styles.subtitle}>
          Your share has been successfully received and credited. The group bill has been updated in real-time.
        </Text>

        {/* Receipt / Status Card Details */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Transaction Status</Text>
            <Text style={[styles.receiptValue, { color: '#00C853' }]}>Completed</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Payment Rail</Text>
            <Text style={styles.receiptValue}>Instant Transfer / NUBAN</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Reference ID</Text>
            <Text style={styles.receiptValue}>KL-89324-NG</Text>
          </View>
        </View>

      </View>

      {/* Footer Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.primaryButtonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 83, 0.3)',
  },
  successIconInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#161E31',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A3447',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  receiptLabel: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 13,
    color: '#94A3B8',
  },
  receiptValue: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    backgroundColor: '#161E31',
    borderTopWidth: 1,
    borderTopColor: '#2A3447',
  },
  primaryButton: {
    backgroundColor: '#00C853',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 16,
    color: '#0A0F1D',
  },
});