import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

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
      <Text>Create New Bill</Text>
       <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Total Amount (N)"
      />
      <Text>Enter total bill amount</Text>
      <Button
        title="Generate Bill"
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
