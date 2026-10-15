// import { AbrilFatface_400Regular, useFonts } from "@expo-google-fonts/abril-fatface";
// import { Stack } from "expo-router";
// import { Text } from "react-native";

// export default function RootLayout() {
//   const [fontsLoaded] = useFonts({
//     AbrilFatface_400Regular,
//   });

//   if (!fontsLoaded) {
//     return <Text>Loading...</Text>;
//   }
//   return <Stack />;
// }


import { PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, useFonts } from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// Keep the splash screen visible while loading custom fonts
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaRegular: PlusJakartaSans_400Regular,
    PlusJakartaSemiBold: PlusJakartaSans_600SemiBold,
    PlusJakartaBold: PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#0A0F1D" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0A0F1D' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontFamily: 'PlusJakartaBold',
            fontSize: 18,
          },
          contentStyle: { backgroundColor: '#0A0F1D' },
        }}
      >
        <Stack.Screen name="auth/login" options={{ title: 'Sign In', headerShown: false }} />
        <Stack.Screen name="index" options={{ title: 'Kalo', headerShown: false }} />
        <Stack.Screen name="bill/create" options={{ title: 'Create New Split' }} />
        <Stack.Screen name="bill/scanner" options={{ title: 'Scan Receipt' }} />
        <Stack.Screen name="bill/itemize" options={{ title: 'Claim Items' }} />
        <Stack.Screen name="bill/[id]" options={{ title: 'Bill Summary' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0F1D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});