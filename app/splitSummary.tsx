import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import BillSummaryCard from "../components/billSummaryCard";

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
      <Text>Your Share</Text>
      <BillSummaryCard
        totalBill={25000}
        numberOfPeople={4}
        yourShare={6250}
      />
      <Text>Split equally among participants</Text>
      <Button
        title="Pay My Share"
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
