import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function CreateBillScreen() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [participantCount, setParticipantCount] = useState('3');

  const handleNext = () => {
    if (!title || !totalAmount) return;
    
    // Pass the parameters or navigate directly to the scanner/itemization page
    router.push({
      pathname: '/bill/scanner',
      params: { title, totalAmount, taxAmount, participantCount }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create a New Split</Text>
            <Text style={styles.subtitle}>Enter the basic details of the group outing or bill.</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            
            {/* Bill Title */}
            <Text style={styles.label}>Bill Title / Outing Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Terra Kulture Dinner"
              placeholderTextColor="#64748B"
              value={title}
              onChangeText={setTitle}
            />

            {/* Total Amount */}
            <Text style={styles.label}>Total Amount (₦)</Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>₦</Text>
              <TextInput
                style={[styles.textInput, styles.currencyField]}
                placeholder="0.00"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                value={totalAmount}
                onChangeText={setTotalAmount}
              />
            </View>

            {/* Estimated Tax & Tips */}
            <Text style={styles.label}>Estimated Tax, VAT & Service Charge (₦)</Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>₦</Text>
              <TextInput
                style={[styles.textInput, styles.currencyField]}
                placeholder="0.00 (Optional if scanning receipt)"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                value={taxAmount}
                onChangeText={setTaxAmount}
              />
            </View>

            {/* Estimated Participants */}
            <Text style={styles.label}>Estimated Number of People</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity 
                style={styles.counterBtn}
                onPress={() => {
                  const current = parseInt(participantCount) || 1;
                  if (current > 1) setParticipantCount((current - 1).toString());
                }}
              >
                <Ionicons name="remove" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <Text style={styles.counterText}>{participantCount}</Text>
              
              <TouchableOpacity 
                style={styles.counterBtn}
                onPress={() => {
                  const current = parseInt(participantCount) || 0;
                  setParticipantCount((current + 1).toString());
                }}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

          </View>

          {/* Proceed Options: Scan Receipt vs Skip to Manual */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.primaryButton, (!title || !totalAmount) && styles.disabledButton]}
              disabled={!title || !totalAmount}
              onPress={handleNext}
            >
              <MaterialCommunityIcons name="camera-outline" size={20} color="#0A0F1D" style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>Scan Receipt with AI</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/bill/itemize')}
            >
              <Text style={styles.secondaryButtonText}>Skip & Enter Items Manually</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 14,
    color: '#94A3B8',
  },
  formGroup: {
    marginBottom: 30,
  },
  label: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: '#161E31',
    borderWidth: 1,
    borderColor: '#2A3447',
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 16,
    fontFamily: 'PlusJakartaBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  currencySymbol: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    fontFamily: 'PlusJakartaBold',
    fontSize: 16,
    color: '#00C853',
  },
  currencyField: {
    paddingLeft: 36,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161E31',
    borderWidth: 1,
    borderColor: '#2A3447',
    borderRadius: 12,
    height: 54,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2A3447',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#00C853',
    borderRadius: 12,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#1E293B',
    shadowOpacity: 0,
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 16,
    color: '#0A0F1D',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3447',
  },
  secondaryButtonText: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 15,
    color: '#94A3B8',
  },
});