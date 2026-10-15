import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const amountDue = params.myTotalDue || '10,850';

  const [selectedMethod, setSelectedMethod] = useState<'TRANSFER' | 'CARD' | 'FOREIGN'>('TRANSFER');
  const [loading, setLoading] = useState(false);

  // Copy virtual account number to clipboard
  const handleCopyAccount = async () => {
    await Clipboard.setStringAsync('9923847501');
    Alert.alert('Copied!', 'Virtual account number copied to clipboard.');
  };

  const handleCompletePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/checkout/success');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Amount Owed Summary Box */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Amount to Pay</Text>
          <Text style={styles.summaryAmount}>₦{Number(amountDue).toLocaleString()}</Text>
          <Text style={styles.summarySubtext}>Includes your items and pro-rata share of VAT/taxes.</Text>
        </View>

        <Text style={styles.sectionLabel}>Select Payment Method</Text>

        {/* Option 1: Bank Transfer (Monnify / Dynamic Virtual Account) */}
        <TouchableOpacity 
          style={[styles.methodCard, selectedMethod === 'TRANSFER' && styles.selectedMethodCard]}
          onPress={() => setSelectedMethod('TRANSFER')}
        >
          <View style={styles.methodHeader}>
            <View style={styles.methodIconBox}>
              <MaterialCommunityIcons name="bank-transfer" size={22} color="#00C853" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.methodTitle}>Instant Bank Transfer</Text>
              <Text style={styles.methodSubtitle}>Pay via unique NUBAN (Wema / Moniepoint)</Text>
            </View>
            <Ionicons 
              name={selectedMethod === 'TRANSFER' ? 'radio-button-on' : 'radio-button-off'} 
              size={20} 
              color={selectedMethod === 'TRANSFER' ? '#00C853' : '#64748B'} 
            />
          </View>

          {selectedMethod === 'TRANSFER' && (
            <View style={styles.virtualAccountContainer}>
              <View style={styles.vaRow}>
                <View>
                  <Text style={styles.vaLabel}>Bank Name</Text>
                  <Text style={styles.vaValue}>Wema Bank</Text>
                </View>
                <View>
                  <Text style={styles.vaLabel}>Account Number</Text>
                  <Text style={styles.vaValue}>9923847501</Text>
                </View>
                <TouchableOpacity style={styles.copyButton} onPress={handleCopyAccount}>
                  <Ionicons name="copy-outline" size={16} color="#00C853" />
                  <Text style={styles.copyText}>Copy</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.timerText}>⏳ Expires in 14:59 mins. Account closes automatically once paid.</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Option 2: Card / USSD (Paystack / Flutterwave) */}
        <TouchableOpacity 
          style={[styles.methodCard, selectedMethod === 'CARD' && styles.selectedMethodCard]}
          onPress={() => setSelectedMethod('CARD')}
        >
          <View style={styles.methodHeader}>
            <View style={styles.methodIconBox}>
              <MaterialCommunityIcons name="credit-card-outline" size={22} color="#00C853" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.methodTitle}>Debit Card, Apple Pay or USSD</Text>
              <Text style={styles.methodSubtitle}>Mastercard, Visa, Verve</Text>
            </View>
            <Ionicons 
              name={selectedMethod === 'CARD' ? 'radio-button-on' : 'radio-button-off'} 
              size={20} 
              color={selectedMethod === 'CARD' ? '#00C853' : '#64748B'} 
            />
          </View>
        </TouchableOpacity>

        {/* Option 3: Foreign Currency / Diaspora */}
        <TouchableOpacity 
          style={[styles.methodCard, selectedMethod === 'FOREIGN' && styles.selectedMethodCard]}
          onPress={() => setSelectedMethod('FOREIGN')}
        >
          <View style={styles.methodHeader}>
            <View style={styles.methodIconBox}>
              <MaterialCommunityIcons name="earth" size={22} color="#00C853" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.methodTitle}>Foreign Currency / Diaspora</Text>
              <Text style={styles.methodSubtitle}>Pay using USD ($), GBP (£) or EUR (€)</Text>
            </View>
            <Ionicons 
              name={selectedMethod === 'FOREIGN' ? 'radio-button-on' : 'radio-button-off'} 
              size={20} 
              color={selectedMethod === 'FOREIGN' ? '#00C853' : '#64748B'} 
            />
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleCompletePayment}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Confirming Payment...' : `Pay ₦${Number(amountDue).toLocaleString()}`}
          </Text>
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
  scrollContent: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#161E31',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3447',
    marginBottom: 24,
  },
  summaryLabel: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 4,
  },
  summaryAmount: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 32,
    color: '#00C853',
    marginBottom: 6,
  },
  summarySubtext: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  sectionLabel: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 12,
  },
  methodCard: {
    backgroundColor: '#161E31',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A3447',
    marginBottom: 12,
  },
  selectedMethodCard: {
    borderColor: '#00C853',
    backgroundColor: '#131D2E',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodTitle: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  methodSubtitle: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 12,
    color: '#94A3B8',
  },
  virtualAccountContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A3447',
  },
  vaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vaLabel: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  vaValue: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00C853',
  },
  copyText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 13,
    color: '#00C853',
    marginLeft: 4,
  },
  timerText: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 11,
    color: '#FF6F61',
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