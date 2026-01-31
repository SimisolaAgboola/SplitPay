import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from "react-native";

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
        <Ionicons
        name="checkmark-circle"
        size={40}
        color="#0F8A4B"
        />
      <Text>Payment Successful</Text>
      <Text>Your payment has been recorded</Text>
      <Button
        title="Done"
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
