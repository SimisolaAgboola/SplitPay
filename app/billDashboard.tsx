import { router } from "expo-router";
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import FinancialCard from "../components/financialCard";
export default function Index() {
  const [text, setText] = useState('');
  const [pin, setPin] = useState('');
  const handlePress = () =>{
    Alert.alert('Simple button')
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Table Bill</Text>
      <FinancialCard
        total={25000}
        paid={15000}
        participants={[
          { name: "Tunde", paid: true },
          { name: "Amaka", paid: false },
        ]}
      />
      <Button
        title="Show QR Code"
        onPress={() => router.push("/qrCodeScreen")}
        color="black" // Adjusts color (iOS text, Android background)
        accessibilityLabel="Learn more about this button" // Recommended for accessibility
      />
      <Button
        title="Close Bill"
        onPress={handlePress}
        color="black" // Adjusts color (iOS text, Android background)
        accessibilityLabel="Learn more about this button" // Recommended for accessibility
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 2,
  },
});
