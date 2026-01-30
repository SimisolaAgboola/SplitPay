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
      <Text>Logo</Text>
      <Text>Staff Login</Text>
       <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Enter restaurant code"
      />
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={pin}
        placeholder="Enter restaurant pin"
      />
      <Button
        title="Login"
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
