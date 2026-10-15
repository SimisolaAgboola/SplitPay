import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ReceiptScannerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Receives title, totalAmount, etc., from previous screen
  
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [scanning, setScanning] = useState(false);

  // Request permission state check
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <MaterialCommunityIcons name="camera-off" size={64} color="#94A3B8" style={{ marginBottom: 16 }} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          Kalo needs access to your camera to scan physical receipts and auto-parse items using AI.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Handle taking the picture
  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        setScanning(true);
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        
        // Simulate AI OCR processing delay
        setTimeout(() => {
          setScanning(false);
          // Navigate to itemization screen and pass along the image uri
          router.push({
            pathname: '/bill/itemize',
            params: { ...params, imageUri: photo.uri }
          });
        }, 2000);

      } catch (error) {
        setScanning(false);
        Alert.alert('Capture Failed', 'Could not capture receipt image. Please try again.');
      }
    }
  };

  // Handle choosing from phone gallery instead
  const handlePickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      router.push({
        pathname: '/bill/itemize',
        params: { ...params, imageUri: result.assets[0].uri }
      });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        
        {/* Top Header info */}
        <SafeAreaView style={styles.topOverlay}>
          <View style={styles.badgeBox}>
            <Text style={styles.badgeText}>Align receipt within frame</Text>
          </View>
        </SafeAreaView>

        {/* Scanning Loading State Overlay */}
        {scanning && (
          <View style={styles.scanningOverlay}>
            <ActivityIndicator size="large" color="#00C853" />
            <Text style={styles.scanningText}>AI is parsing your receipt...</Text>
          </View>
        )}

        {/* Bottom Control Actions */}
        <SafeAreaView style={styles.bottomControls}>
          <TouchableOpacity style={styles.galleryButton} onPress={handlePickFromGallery}>
            <Ionicons name="image-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButtonOuter} onPress={handleCapture} disabled={scanning}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={{ width: 44 }} /> {/* Spacer to balance layout */}
        </SafeAreaView>

      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0A0F1D',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontFamily: 'PlusJakartaRegular',
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topOverlay: {
    alignItems: 'center',
    paddingTop: 20,
  },
  badgeBox: {
    backgroundColor: 'rgba(10, 15, 29, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A3447',
  },
  badgeText: {
    fontFamily: 'PlusJakartaSemiBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 29, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 16,
    color: '#00C853',
    marginTop: 16,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: 'rgba(10, 15, 29, 0.4)',
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#161E31',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3447',
  },
  captureButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#00C853',
  },
  primaryButton: {
    backgroundColor: '#00C853',
    borderRadius: 12,
    height: 54,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 16,
    color: '#0A0F1D',
  },
});