import React, { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Button, Typography } from '@src/ui/atoms';
import { Analytics } from '@src/core/analytics';
import type { AnalysisResult } from './schema';

interface ResultCardProps {
  result: AnalysisResult;
  onRetake: () => void;
  onDone?: () => void;
}

function scoreColor(score: number) {
  if (score >= 80) return '#34C759';
  if (score >= 60) return '#FFCC00';
  return '#FF453A';
}

function scoreLabel(score: number) {
  if (score >= 80) return 'Great';
  if (score >= 60) return 'Okay';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

const METRIC_ICONS: Record<string, string> = {
  bristol: '💩',
  color: '🎨',
  fragmentation: '🧩',
  edge: '🔍',
  volume: '📏',
};

export function ResultCard({ result, onRetake, onDone }: ResultCardProps) {
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

      Analytics.trackResultShared();
    } catch (error) {
      Alert.alert('Share failed', 'Could not share result card.');
    } finally {
      setIsSharing(false);
    }
  };

  const color = scoreColor(result.gut_score);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View ref={cardRef} collapsable={false} style={styles.card}>
        {/* ── Score Hero ── */}
        <View style={styles.scoreSection}>
          <View style={[styles.scoreBadge, { borderColor: color }]}>  
            <Typography style={[styles.scoreNumber, { color }]}>
              {result.gut_score}
            </Typography>
            <Typography variant="caption" style={[styles.scoreLabel, { color }]}>
              {scoreLabel(result.gut_score)}
            </Typography>
          </View>
          <Typography variant="body" color="#8B92A1" style={styles.scoreSubtext}>
            Gut Score
          </Typography>
        </View>

        {/* ── Score Bar ── */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.max(0, Math.min(100, result.gut_score))}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>

        {/* ── Metrics ── */}
        <View style={styles.metricsGrid}>
          <MetricCard icon={METRIC_ICONS.bristol} label="Bristol" value={`Type ${result.bristol_type}`} />
          <MetricCard icon={METRIC_ICONS.color} label="Color" value={result.color} />
          <MetricCard icon={METRIC_ICONS.fragmentation} label="Fragment" value={result.fragmentation} />
          <MetricCard icon={METRIC_ICONS.edge} label="Edge" value={result.edge_fuzziness} />
          <MetricCard icon={METRIC_ICONS.volume} label="Volume" value={result.volume} />
        </View>

        {/* ── Health Insight ── */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Typography style={styles.insightIcon}>💡</Typography>
            <Typography variant="body" color="#9FA6B3" style={styles.insightLabel}>
              Health Insight
            </Typography>
          </View>
          <Typography variant="body" style={styles.insightText}>
            {result.health_insight}
          </Typography>
        </View>

        {/* ── Humor ── */}
        <View style={styles.humorCard}>
          <View style={styles.insightHeader}>
            <Typography style={styles.insightIcon}>😄</Typography>
            <Typography variant="body" color="#9FA6B3" style={styles.insightLabel}>
              Humor Check
            </Typography>
          </View>
          <Typography variant="body" style={styles.insightText}>
            {result.humor_comment}
          </Typography>
        </View>

        {/* ── Warning ── */}
        {result.warning && (
          <View style={styles.warningBox}>
            <Typography style={styles.warningIcon}>⚠️</Typography>
            <Typography variant="body" color="#FF9B9B" style={styles.warningText}>
              {result.warning_detail || 'Potential warning signs detected.'}
            </Typography>
          </View>
        )}

        {/* ── Disclaimer + Brand ── */}
        <Typography variant="caption" color="#5D6472" style={styles.disclaimer}>
          PoopAI provides wellness insights only and is not a medical diagnosis.
        </Typography>

        <View style={styles.brandRow}>
          <Typography variant="caption" color="#3A3F4B">
            💩 PoopAI
          </Typography>
        </View>
      </View>

      {/* ── Actions ── */}
      <View style={styles.actions}>
        <Button
          title="Retake"
          variant="outline"
          onPress={onRetake}
          style={styles.actionButton}
        />
        <Button
          title={isSharing ? 'Sharing...' : 'Share'}
          variant="outline"
          onPress={shareResult}
          loading={isSharing}
          style={styles.actionButton}
        />
      </View>

      {onDone && (
        <Button
          title="Done"
          onPress={onDone}
          style={styles.doneButton}
        />
      )}
    </ScrollView>
  );
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Typography style={styles.metricIcon}>{icon}</Typography>
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
    paddingBottom: 32,
    gap: 16,
  },
  card: {
    backgroundColor: '#141821',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#212736',
    gap: 16,
  },

  /* ── Score Hero ── */
  scoreSection: {
    alignItems: 'center',
    paddingTop: 8,
    gap: 8,
  },
  scoreBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  scoreNumber: {
    fontSize: 40,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: -2,
  },
  scoreSubtext: {
    fontSize: 14,
  },

  /* ── Progress ── */
  progressTrack: {
    height: 10,
    backgroundColor: '#242B3A',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  /* ── Metrics ── */
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCard: {
    backgroundColor: '#1C2230',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: '30%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#2A3244',
    gap: 2,
  },
  metricIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  metricValue: {
    color: '#FFFFFF',
    textTransform: 'capitalize',
    fontWeight: '600',
    marginTop: 2,
  },

  /* ── Insight / Humor Cards ── */
  insightCard: {
    backgroundColor: '#1A2030',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#252D3E',
    gap: 8,
  },
  humorCard: {
    backgroundColor: '#1E1A28',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2D2540',
    gap: 8,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightIcon: {
    fontSize: 16,
  },
  insightLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  insightText: {
    color: '#FFFFFF',
    lineHeight: 22,
  },

  /* ── Warning ── */
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(255,69,58,0.12)',
    borderColor: 'rgba(255,69,58,0.4)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  warningIcon: {
    fontSize: 22,
    marginTop: 1,
  },
  warningText: {
    flex: 1,
    lineHeight: 22,
  },

  /* ── Footer ── */
  disclaimer: {
    lineHeight: 18,
    textAlign: 'center',
  },
  brandRow: {
    alignItems: 'center',
  },

  /* ── Actions ── */
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  doneButton: {
    backgroundColor: '#0D3DFF',
  },
});
