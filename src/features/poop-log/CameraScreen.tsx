import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button, Typography } from '@src/ui/atoms';
import { Analytics } from '@src/core/analytics';
import { pixelateImage } from '@src/utils/pixelate';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FRAME_SIZE = SCREEN_WIDTH * 0.72;
const CORNER_SIZE = 28;
const CORNER_THICKNESS = 4;
const CORNER_RADIUS = 12;

interface CameraScreenProps {
  onCaptured: (base64: string) => void;
}

/** Rounded corner bracket drawn with two View edges */
function FrameCorner({
  position,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
}) {
  const isTop = position[0] === 't';
  const isLeft = position[1] === 'l';

  return (
    <View
      style={[
        styles.corner,
        {
          [isTop ? 'top' : 'bottom']: 0,
          [isLeft ? 'left' : 'right']: 0,
          [isTop ? 'borderTopWidth' : 'borderBottomWidth']: CORNER_THICKNESS,
          [isLeft ? 'borderLeftWidth' : 'borderRightWidth']: CORNER_THICKNESS,
          [isTop && isLeft
            ? 'borderTopLeftRadius'
            : isTop && !isLeft
              ? 'borderTopRightRadius'
              : !isTop && isLeft
                ? 'borderBottomLeftRadius'
                : 'borderBottomRightRadius']: CORNER_RADIUS,
        },
      ]}
    />
  );
}

/** Pixel grid overlay to hint at the pixelation effect */
function GridOverlay() {
  const gridSize = 16;
  const cellSize = FRAME_SIZE / gridSize;
  
  const rows = [];
  for (let i = 0; i < gridSize; i++) {
    const cols = [];
    for (let j = 0; j < gridSize; j++) {
      cols.push(
        <View
          key={`${i}-${j}`}
          style={[
            styles.gridCell,
            {
              width: cellSize,
              height: cellSize,
            },
          ]}
        />
      );
    }
    rows.push(
      <View key={i} style={styles.gridRow}>
        {cols}
      </View>
    );
  }
  
  return <View style={styles.gridContainer}>{rows}</View>;
}

export function CameraScreen({ onCaptured }: CameraScreenProps) {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [previewBase64, setPreviewBase64] = useState<string | null>(null);
  const [originalBase64, setOriginalBase64] = useState<string | null>(null);
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

      const pixelated = await pixelateImage(photo.base64);
      
      setOriginalBase64(photo.base64);
      setPreviewBase64(pixelated);
      Analytics.trackPhotoCaptured();
    } catch {
      Alert.alert('Capture failed', 'Could not capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const confirmAnalyze = () => {
    if (!originalBase64) return;
    onCaptured(originalBase64);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // If user already denied once, canAskAgain is false — must go to Settings
    const denied = permission.canAskAgain === false;

    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Typography variant="h1" style={styles.permissionTitle}>
          Camera Access Needed
        </Typography>
        <Typography variant="body" color="#A4A9B6" style={styles.permissionText}>
          {denied
            ? 'Camera permission was denied. Please enable it in Settings to continue.'
            : 'PoopAI needs camera access to analyze stool images.'}
        </Typography>
        {denied ? (
          <Button title="Open Settings" onPress={() => Linking.openSettings()} />
        ) : (
          <Button title="Allow Camera" onPress={requestPermission} />
        )}
      </SafeAreaView>
    );
  }

  /* ── Preview (after capture) ── */
  if (previewBase64) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          {/* Top bar */}
          <View style={styles.previewTopBar}>
            <Typography variant="body" color="#FFFFFF" style={styles.previewTitle}>
              Review Photo
            </Typography>
          </View>

          <Image
            source={{ uri: `data:image/jpeg;base64,${previewBase64}` }}
            style={styles.previewImage}
            resizeMode="cover"
          />

          <View style={styles.previewHint}>
            <Typography variant="caption" color="#A4A9B6" style={styles.hintText}>
              Make sure the image is clear and well-lit
            </Typography>
          </View>

          <View style={styles.previewActions}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => {
                setPreviewBase64(null);
                setOriginalBase64(null);
              }}
              activeOpacity={0.7}
            >
              <Typography variant="body" color="#FFFFFF" style={styles.retakeText}>
                ↩ Retake
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={confirmAnalyze}
              activeOpacity={0.8}
            >
              <Typography variant="body" color="#FFFFFF" style={styles.analyzeText}>
                ✓ Analyze
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /* ── Live camera ── */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        flash={flash}
        ref={cameraRef}
      />

      {/* Dimmed overlay outside frame */}
      <View style={styles.overlayContainer} pointerEvents="none">
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddleRow}>
          <View style={styles.overlaySide} />
          <View style={styles.frameCutout}>
            <GridOverlay />
            <FrameCorner position="tl" />
            <FrameCorner position="tr" />
            <FrameCorner position="bl" />
            <FrameCorner position="br" />
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom} />
      </View>

      {/* Hint text below frame */}
      <View style={styles.hintContainer} pointerEvents="none">
        <Typography variant="body" color="rgba(255,255,255,0.85)" style={styles.hintText}>
          Position stool in the frame
        </Typography>
      </View>

      {/* Top controls */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Typography color="#FFFFFF" style={styles.controlIcon}>✕</Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, flash === 'on' && styles.controlButtonActive]}
          onPress={() => setFlash((prev) => (prev === 'off' ? 'on' : 'off'))}
          activeOpacity={0.7}
        >
          <Typography color="#FFFFFF" style={styles.controlIcon}>
            {flash === 'off' ? '⚡' : '⚡'}
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Capture button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.captureButtonOuter}
          onPress={takePhoto}
          disabled={isCapturing}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.captureButtonInner,
              isCapturing && styles.captureButtonCapturing,
            ]}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const OVERLAY_COLOR = 'rgba(0,0,0,0.55)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  /* ── Permission ── */
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

  /* ── Overlay / Frame ── */
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: OVERLAY_COLOR,
  },
  overlayMiddleRow: {
    flexDirection: 'row',
    height: FRAME_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: OVERLAY_COLOR,
  },
  frameCutout: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    // transparent center
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'transparent',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: OVERLAY_COLOR,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#FFFFFF',
  },

  /* ── Hint ── */
  hintContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: FRAME_SIZE / 2 + 18,
    alignItems: 'center',
  },
  hintText: {
    textAlign: 'center',
    fontSize: 14,
  },

  /* ── Top controls ── */
  topControls: {
    position: 'absolute',
    top: 58,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(13,61,255,0.7)',
  },
  controlIcon: {
    fontSize: 20,
  },

  /* ── Capture ── */
  bottomArea: {
    position: 'absolute',
    bottom: 40,
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
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
  captureButtonCapturing: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  /* ── Preview ── */
  previewContainer: {
    flex: 1,
    backgroundColor: '#0D0F14',
  },
  previewTopBar: {
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: 'center',
  },
  previewTitle: {
    fontWeight: '600',
    fontSize: 17,
  },
  previewImage: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 20,
  },
  previewHint: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  retakeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  retakeText: {
    fontWeight: '600',
    fontSize: 16,
  },
  analyzeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#0D3DFF',
    alignItems: 'center',
  },
  analyzeText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
