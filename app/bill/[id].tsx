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

export default function ActiveBillScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock data for the active bill session
  const [billData] = useState({
    title: 'Terra Kulture Hangout',
    totalAmount: 45000,
    amountPaid: 22500, // 50% funded
    participants: [
      { id: '1', name: 'Chidi Okoro (You)', amount: 10850, hasPaid: true },
      { id: '2', name: 'Tola Aderibigbe', amount: 11650, hasPaid: true },
      { id: '3', name: 'Kemi Adebayo', amount: 11250, hasPaid: false },
      { id: '4', name: 'Emeka Obi', amount: 11250, hasPaid: false },
    ]
  });

  const progressPercentage = (billData.amountPaid / billData.totalAmount) * 100;

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`https://kalo.app/bill/${id}`);
    Alert.alert('Link Copied!', 'Share this link with your friends on WhatsApp to let them pay their share.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Bill Title & Status Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="receipt" size={24} color="#00C853" />
            </View>
            <TouchableOpacity style={styles.shareButton} onPress={handleCopyLink}>
              <Ionicons name="share-social-outline" size={18} color="#00C853" />
              <Text style={styles.shareText}>Invite Friends</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.billTitle}>{billData.title}</Text>
          <Text style={styles.billTotal}>Total Bill: ₦{billData.totalAmount.toLocaleString()}</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
            <View style={styles.progressStatsRow}>
              <Text style={styles.progressText}>₦{billData.amountPaid.toLocaleString()} Raised</Text>
              <Text style={styles.progressText}>{progressPercentage}% Funded</Text>
            </View>
          </View>
        </View>

        {/* Participants Status Section */}
        <Text style={styles.sectionLabel}>Participants & Payment Status</Text>

        {billData.participants.map((person) => (
          <View key={person.id} style={styles.participantCard}>
            <View style={styles.participantInfo}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarText}>{person.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.participantName}>{person.name}</Text>
                <Text style={styles.participantAmount}>Owes ₦{person.amount.toLocaleString()}</Text>
              </View>
            </View>

            <View style={[styles.statusBadge, person.hasPaid ? styles.paidBadge : styles.pendingBadge]}>
              <Ionicons 
                name={person.hasPaid ? 'checkmark-circle' : 'time-outline'} 
                size={14} 
                color={person.hasPaid ? '#00C853' : '#FF6F61'} 
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.statusText, { color: person.hasPaid ? '#00C853' : '#FF6F61' }]}>
                {person.hasPaid ? 'Paid' : 'Pending'}
              </Text>
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push({
            pathname: '/checkout/payment-methods',
            params: { myTotalDue: '10850' }
          })}
        >
          <Text style={styles.primaryButtonText}>Pay Your Share (₦10,850)</Text>
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
  headerCard: {
    backgroundColor: '#161E31',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A3447',
    marginBottom: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00C853',
  },
  shareText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 13,
    color: '#00C853',
    marginLeft: 6,
  },
  billTitle: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  billTotal: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#2A3447',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00C853',
    borderRadius: 4,
  },
  progressStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 12,
    color: '#94A3B8',
  },
  sectionLabel: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 12,
  },
  participantCard: {
    backgroundColor: '#161E31',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3447',
    marginBottom: 10,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2A3447',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  participantName: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  participantAmount: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 12,
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  paidBadge: {
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
  },
  pendingBadge: {
    backgroundColor: 'rgba(255, 111, 97, 0.1)',
  },
  statusText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 12,
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