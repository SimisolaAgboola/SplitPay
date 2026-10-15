// import { router } from "expo-router";
// import React, { useState } from 'react';
// import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

// export default function Index() {
//   const [text, setText] = useState('');
//   const [pin, setPin] = useState('');
//   const handlePress = () =>{
//     Alert.alert('Simple button')
//   }
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#3FA34D",
//       }}
//     >
//       <Text style={styles.title}>Logo</Text>
//       <Text style={styles.title}>Staff Login</Text>
//        <TextInput
//         style={styles.input}
//         onChangeText={setText}
//         value={text}
//         placeholder="Enter restaurant code"
//       />
//       <TextInput
//         style={styles.input}
//         onChangeText={setPin}
//         value={pin}
//         placeholder="Enter restaurant pin"
//       />
//       <Button
//         title="Login"
//         onPress={() => router.push("/createBill")}
//         color="black"
//         accessibilityLabel="Learn more about this button" 
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   input: {  
//     borderRadius: 5,
//     borderColor: 'black',
//     borderWidth: 2,
//   },
//   title: {
//     fontFamily: "AbrilFatface_400Regular",
//     fontSize: 28,
//     color: "#ffffff",
//   }
// });

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  // Mock data for ongoing group bills
  const activeBills = [
    { id: '1', title: 'Terra Kulture Hangout', total: '₦45,000', status: '2/4 Paid', progress: 0.5 },
    { id: '2', title: 'Lekki Phase 1 Brunch', total: '₦120,000', status: 'Fully Funded', progress: 1.0 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Profile Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.usernameText}>Chidi 👋</Text>
          </View>
          <TouchableOpacity style={styles.profileBadge}>
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Wallet / Summary Card */}
        <View style={styles.walletCard}>
          <View>
            <Text style={styles.walletLabel}>Pending Collections</Text>
            <Text style={styles.walletAmount}>₦22,500</Text>
          </View>
          <MaterialCommunityIcons name="wallet-outline" size={32} color="#00C853" />
        </View>

        {/* Action Button: Create New Split */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/bill/create')}
        >
          <Ionicons name="add-circle-outline" size={20} color="#0A0F1D" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>Start New Bill Split</Text>
        </TouchableOpacity>

        {/* Active Bills Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Group Bills</Text>
          <Text style={styles.seeAllText}>See all</Text>
        </View>

        {activeBills.map((bill) => (
          <TouchableOpacity 
            key={bill.id} 
            style={styles.billCard}
            onPress={() => router.push(`/bill/${bill.id}`)}
          >
            <View style={styles.billCardLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="receipt" size={20} color="#00C853" />
              </View>
              <View>
                <Text style={styles.billTitle}>{bill.title}</Text>
                <Text style={styles.billTotal}>{bill.total} • <Text style={{ color: bill.progress === 1 ? '#00C853' : '#FF6F61' }}>{bill.status}</Text></Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        ))}

      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  welcomeText: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 14,
    color: '#94A3B8',
  },
  usernameText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 22,
    color: '#FFFFFF',
  },
  profileBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#161E31',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3447',
  },
  walletCard: {
    backgroundColor: '#161E31',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3447',
    marginBottom: 20,
  },
  walletLabel: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 4,
  },
  walletAmount: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 26,
    color: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#00C853',
    borderRadius: 14,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  seeAllText: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 13,
    color: '#00C853',
  },
  billCard: {
    backgroundColor: '#161E31',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3447',
    marginBottom: 12,
  },
  billCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  billTitle: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  billTotal: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 13,
    color: '#94A3B8',
  },
});

