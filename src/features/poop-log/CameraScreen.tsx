import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import { Button, Typography } from '@src/ui/atoms';

interface CameraScreenProps {
  onCaptured: (base64: string) => void;
}

export function CameraScreen({ onCaptured }: CameraScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [previewBase64, setPreviewBase64] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  const takePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });

      if (!photo?.base64) {
        throw new Error('Failed to capture image');
      }

      setPreviewBase64(photo.base64);
    } catch (error) {
      Alert.alert('Capture failed', 'Could not capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const confirmAnalyze = () => {
    if (!previewBase64) return;
    onCaptured(previewBase64);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Typography variant="h1" style={styles.permissionTitle}>
          Camera Access Needed
        </Typography>
        <Typography variant="body" color="#A4A9B6" style={styles.permissionText}>
          PoopAI needs camera access to analyze stool images.
        </Typography>
        <Button title="Allow Camera" onPress={requestPermission} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {previewBase64 ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${previewBase64}` }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <View style={styles.previewActions}>
            <Button
              title="Retake"
              variant="outline"
              onPress={() => setPreviewBase64(null)}
              style={styles.actionButton}
            />
            <Button
              title="Analyze"
              onPress={confirmAnalyze}
              style={styles.actionButton}
            />
          </View>
        </View>
      ) : (
        <>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing={facing}
            flash={flash}
            ref={cameraRef}
          />

          <View style={styles.topActions}>
            <TouchableOpacity
              onPress={() => setFlash((prev) => (prev === 'off' ? 'on' : 'off'))}
              style={styles.iconButton}
            >
              <Typography color="#FFFFFF">{flash === 'off' ? '⚡️ Off' : '⚡️ On'}</Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFacing((prev) => (prev === 'back' ? 'front' : 'back'))}
              style={styles.iconButton}
            >
              <Typography color="#FFFFFF">🔄 Flip</Typography>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomArea}>
            <TouchableOpacity
              style={styles.captureButtonOuter}
              onPress={takePhoto}
              disabled={isCapturing}
              activeOpacity={0.8}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0D0F14',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  permissionTitle: {
    color: '#FFFFFF',
  },
  permissionText: {
    marginBottom: 8,
  },
  topActions: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButtonOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  captureButtonInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FFFFFF',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#0D0F14',
  },
  previewImage: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
});
