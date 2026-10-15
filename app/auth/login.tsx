import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle phone submission & simulate sending OTP
  const handleSendOtp = () => {
    if (phoneNumber.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 1000);
  };

  // Handle OTP verification & redirect to home
  const handleVerifyOtp = () => {
    if (otp.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Replace with home dashboard on success
      router.replace('/'); 
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          
          {/* Back Button if in OTP step */}
          {step === 'OTP' && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setStep('PHONE')}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {/* Heading Section */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              {step === 'PHONE' ? 'What is your phone number?' : 'Enter verification code'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 'PHONE' 
                ? 'We will send a 4-digit code to verify your account.' 
                : `Code sent to +234 ${phoneNumber}`}
            </Text>
          </View>

          {/* Input Section */}
          {step === 'PHONE' ? (
            <View style={styles.inputGroup}>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCodeText}>🇳🇬 +234</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="803 000 0000"
                  placeholderTextColor="#64748B"
                  keyboardType="phone-pad"
                  maxLength={11}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>

              <TouchableOpacity 
                style={[styles.primaryButton, phoneNumber.length < 10 && styles.disabledButton]}
                disabled={phoneNumber.length < 10 || loading}
                onPress={handleSendOtp}
              >
                {loading ? (
                  <ActivityIndicator color="#0A0F1D" />
                ) : (
                  <Text style={styles.primaryButtonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.textInput, styles.otpInput]}
                placeholder="• • • •"
                placeholderTextColor="#64748B"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
              />

              <TouchableOpacity 
                style={[styles.primaryButton, otp.length < 4 && styles.disabledButton]}
                disabled={otp.length < 4 || loading}
                onPress={handleVerifyOtp}
              >
                {loading ? (
                  <ActivityIndicator color="#0A0F1D" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify & Proceed</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't get the code? <Text style={{ color: '#00C853' }}>Resend</Text></Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#161E31',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A3447',
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  inputGroup: {
    width: '100%',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  countryCodeBox: {
    backgroundColor: '#161E31',
    borderWidth: 1,
    borderColor: '#2A3447',
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    height: 56,
  },
  countryCodeText: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#161E31',
    borderWidth: 1,
    borderColor: '#2A3447',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    fontFamily: 'PlusJakartaBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#00C853',
    borderRadius: 12,
    height: 56,
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
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 14,
    color: '#94A3B8',
  },
});