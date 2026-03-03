import React, { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Button, Typography } from '@src/ui/atoms';
import type { AnalysisResult } from './schema';

interface ResultCardProps {
  result: AnalysisResult;
  onRetake: () => void;
}

function scoreColor(score: number) {
  if (score >= 80) return '#34C759';
  if (score >= 60) return '#FFCC00';
  return '#FF453A';
}

export function ResultCard({ result, onRetake }: ResultCardProps) {
  const cardRef = useRef<View>(null);
  const [isSharing, setIsSharing] = useState(false);

  const shareResult = async () => {
    if (!cardRef.current) return;

    try {
      setIsSharing(true);

      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 0.95,
      });

      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Sharing unavailable', 'Sharing is not supported on this device.');
        return;
      }

      await Sharing.shareAsync(uri, {
        dialogTitle: 'Share your PoopAI result',
      });
    } catch (error) {
      Alert.alert('Share failed', 'Could not share result card.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View ref={cardRef} collapsable={false} style={styles.card}>
        <Typography variant="h1" style={styles.title}>
          💩 Gut Score {result.gut_score}
        </Typography>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.max(0, Math.min(100, result.gut_score))}%`,
                backgroundColor: scoreColor(result.gut_score),
              },
            ]}
          />
        </View>

        <View style={styles.metricsGrid}>
          <Metric label="Bristol" value={`Type ${result.bristol_type}`} />
          <Metric label="Color" value={result.color} />
          <Metric label="Fragment" value={result.fragmentation} />
          <Metric label="Edge" value={result.edge_fuzziness} />
          <Metric label="Volume" value={result.volume} />
        </View>

        <View style={styles.section}>
          <Typography variant="body" color="#9FA6B3">
            Health Insight
          </Typography>
          <Typography variant="body" style={styles.sectionText}>
            {result.health_insight}
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="body" color="#9FA6B3">
            Humor Check
          </Typography>
          <Typography variant="body" style={styles.sectionText}>
            {result.humor_comment}
          </Typography>
        </View>

        {result.warning && (
          <View style={styles.warningBox}>
            <Typography variant="body" color="#FF9B9B">
              ⚠️ {result.warning_detail || 'Potential warning signs detected.'}
            </Typography>
          </View>
        )}

        <Typography variant="caption" color="#8B92A1" style={styles.disclaimer}>
          PoopAI provides wellness insights only and is not a medical diagnosis.
        </Typography>

        <Typography variant="caption" color="#5D6472" style={styles.brand}>
          PoopAI
        </Typography>
      </View>

      <View style={styles.actions}>
        <Button title="Retake" variant="outline" onPress={onRetake} style={styles.actionButton} />
        <Button
          title={isSharing ? 'Sharing...' : 'Share'}
          onPress={shareResult}
          loading={isSharing}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Typography variant="caption" color="#9FA6B3">
        {label}
      </Typography>
      <Typography variant="body" style={styles.metricValue}>
        {value}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D12',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#141821',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#212736',
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 14,
  },
  progressTrack: {
    height: 12,
    backgroundColor: '#242B3A',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#1C2230',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: '30%',
    borderWidth: 1,
    borderColor: '#2A3244',
  },
  metricValue: {
    marginTop: 4,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 8,
    gap: 6,
  },
  sectionText: {
    color: '#FFFFFF',
    lineHeight: 22,
  },
  warningBox: {
    marginTop: 12,
    backgroundColor: 'rgba(255,69,58,0.12)',
    borderColor: 'rgba(255,69,58,0.4)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  disclaimer: {
    marginTop: 16,
    lineHeight: 18,
  },
  brand: {
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
});
