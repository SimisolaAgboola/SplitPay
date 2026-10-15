import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ItemizeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Mock parsed items from OCR scanner (or manual entry fallback)
  const [items, setItems] = useState([
    { id: '1', name: 'Jollof Rice & Turkey', price: 6500, claimedBy: 'Chidi' },
    { id: '2', name: 'Grilled Chicken & Chips', price: 8000, claimedBy: 'Unassigned' },
    { id: '3', name: 'Chapman (Shared)', price: 4000, claimedBy: 'Shared (50/50)' },
    { id: '4', name: 'Bottled Water x2', price: 1000, claimedBy: 'Unassigned' },
  ]);

  const [taxAndService] = useState(2350); // Pro-rata shared tax/VAT
  const [selectedItemForSplit, setSelectedItemForSplit] = useState<any>(null);
  const [percentageModalVisible, setPercentageModalVisible] = useState(false);

  // Calculate current user's subtotal
  const mySubtotal = items
    .filter(item => item.claimedBy === 'Chidi')
    .reduce((sum, item) => sum + item.price, 0);

  const myProRataTax = Math.round(taxAndService * (mySubtotal / 19500)); // Pro-rata proportion
  const myTotalDue = mySubtotal + myProRataTax;

  const handleProceedToPayment = () => {
    router.push({
      pathname: '/checkout/payment-methods',
      params: { ...params, myTotalDue: myTotalDue.toString() }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>{params.title || 'Group Bill Split'}</Text>
          <Text style={styles.headerSubtitle}>Tap items you ordered or adjust percentages</Text>
        </View>
        <TouchableOpacity 
          style={styles.shareIconButton}
          onPress={() => alert('Link copied to clipboard! Share via WhatsApp.')}
        >
          <Ionicons name="share-social-outline" size={20} color="#00C853" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Item List Header */}
        <Text style={styles.sectionLabel}>Receipt Line Items</Text>

        {items.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemCard}
            onPress={() => {
              setSelectedItemForSplit(item);
              setPercentageModalVisible(true);
            }}
          >
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₦{item.price.toLocaleString()}</Text>
            </View>
            <View style={styles.claimBadge}>
              <Text style={styles.claimBadgeText}>{item.claimedBy}</Text>
              <Ionicons name="chevron-forward" size={14} color="#94A3B8" style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Pro-rata Shared Charges Box */}
        <View style={styles.taxBox}>
          <View style={styles.taxRow}>
            <Text style={styles.taxLabel}>VAT & Service Charge (Pro-rata)</Text>
            <Text style={styles.taxValue}>₦{taxAndService.toLocaleString()}</Text>
          </View>
          <Text style={styles.taxInfoText}>Distributed proportionally based on items claimed.</Text>
        </View>

      </ScrollView>

      {/* Sticky Bottom Checkout Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Your Total Share</Text>
          <Text style={styles.footerAmount}>₦{myTotalDue.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={handleProceedToPayment}>
          <Text style={styles.primaryButtonText}>Proceed to Pay</Text>
          <Ionicons name="arrow-forward" size={18} color="#0A0F1D" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

      {/* Percentage Split Modal for Shared Items */}
      <Modal
        visible={percentageModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Split "{selectedItemForSplit?.name}"</Text>
            <Text style={styles.modalSubtitle}>Allocate percentage share for this item among participants.</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                setPercentageModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>Claim 100% (₦{selectedItemForSplit?.price})</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                setPercentageModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>Split 50 / 50</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setPercentageModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#161E31',
  },
  headerTitle: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  shareIconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#161E31',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3447',
  },
  scrollContent: {
    padding: 20,
  },
  sectionLabel: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#161E31',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3447',
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemPrice: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 14,
    color: '#00C853',
  },
  claimBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3447',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  claimBadgeText: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  taxBox: {
    backgroundColor: '#161E31',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A3447',
    marginTop: 10,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taxLabel: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  taxValue: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  taxInfoText: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 11,
    color: '#94A3B8',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#161E31',
    borderTopWidth: 1,
    borderTopColor: '#2A3447',
  },
  footerLabel: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 12,
    color: '#94A3B8',
  },
  footerAmount: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#00C853',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 15,
    color: '#0A0F1D',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 29, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#161E31',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#2A3447',
  },
  modalTitle: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 20,
  },
  modalOption: {
    backgroundColor: '#0A0F1D',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A3447',
  },
  modalOptionText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 15,
    color: '#00C853',
  },
  modalCloseButton: {
    padding: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 14,
    color: '#94A3B8',
  },
});