import React, { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";

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
      <Text>Scan to Pay</Text>
      <Image source={require("../assets/images/qrcode.png")} />
      <Text>Bill ID</Text>
      <Text>Scan this QR code to split and pay the bill</Text>
      <Button
        title="Back to Dashboard"
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
