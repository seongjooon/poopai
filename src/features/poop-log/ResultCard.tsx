import React, { useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { Button, Typography } from '@src/ui/atoms';
import { Analytics } from '@src/core/analytics';
import { useTheme, type ThemePalette } from '@config/theme';
import type { AnalysisResult } from './schema';

interface ResultCardProps {
  result: AnalysisResult;
  onRetake: () => void;
  onDone?: () => void;
}

function scoreColor(score: number, theme: ThemePalette) {
  if (score >= 80) return theme.success;
  if (score >= 60) return theme.warning;
  return theme.error;
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
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const cardRef = useRef<View>(null);
  const [isSharing, setIsSharing] = useState(false);
  const insets = useSafeAreaInsets();

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
    } catch {
      Alert.alert('Share failed', 'Could not share result card.');
    } finally {
      setIsSharing(false);
    }
  };

  const color = scoreColor(result.gut_score, theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.navBar}>
        <Pressable
          onPress={onDone ?? onRetake}
          hitSlop={12}
          style={styles.navBackButton}
        >
          <Typography style={styles.navBackIcon}>←</Typography>
        </Pressable>
        <Typography variant="body" style={styles.navTitle}>
          Analysis Result
        </Typography>
        <Pressable
          onPress={shareResult}
          hitSlop={12}
          style={styles.navShareButton}
        >
          <Typography style={styles.navShareIcon}>
            {isSharing ? '⏳' : '↗'}
          </Typography>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View ref={cardRef} collapsable={false} style={styles.card}>
          <View style={styles.scoreSection}>
            <View style={[styles.scoreBadge, { borderColor: color }]}>
              <Typography style={[styles.scoreNumber, { color }]}>
                {result.gut_score}
              </Typography>
              <Typography variant="caption" style={[styles.scoreLabel, { color }]}>
                {scoreLabel(result.gut_score)}
              </Typography>
            </View>
            <Typography variant="body" color={theme.secondaryLabel} style={styles.scoreSubtext}>
              Gut Score
            </Typography>
          </View>

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

          <View style={styles.metricsGrid}>
            <MetricCard icon={METRIC_ICONS.bristol} label="Bristol" value={`Type ${result.bristol_type}`} />
            <MetricCard icon={METRIC_ICONS.color} label="Color" value={result.color} />
            <MetricCard icon={METRIC_ICONS.fragmentation} label="Fragment" value={result.fragmentation} />
            <MetricCard icon={METRIC_ICONS.edge} label="Edge" value={result.edge_fuzziness} />
            <MetricCard icon={METRIC_ICONS.volume} label="Volume" value={result.volume} />
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Typography style={styles.insightIcon}>💡</Typography>
              <Typography variant="body" color={theme.tertiaryLabel} style={styles.insightLabel}>
                Health Insight
              </Typography>
            </View>
            <Typography variant="body" style={styles.insightText}>
              {result.health_insight}
            </Typography>
          </View>

          <View style={styles.humorCard}>
            <View style={styles.insightHeader}>
              <Typography style={styles.insightIcon}>😄</Typography>
              <Typography variant="body" color={theme.tertiaryLabel} style={styles.insightLabel}>
                Humor Check
              </Typography>
            </View>
            <Typography variant="body" style={styles.insightText}>
              {result.humor_comment}
            </Typography>
          </View>

          {result.warning && (
            <View style={styles.warningBox}>
              <Typography style={styles.warningIcon}>⚠️</Typography>
              <Typography variant="body" color={theme.error} style={styles.warningText}>
                {result.warning_detail || 'Potential warning signs detected.'}
              </Typography>
            </View>
          )}

          <Typography variant="caption" color={theme.tertiaryLabel} style={styles.disclaimer}>
            For informational and educational purposes only. Not intended as medical advice, diagnosis, or treatment. Consult a healthcare professional for any health concerns.
          </Typography>

          <View style={styles.brandRow}>
            <Typography variant="caption" color={theme.secondaryLabel}>
              💩 PoopAI
            </Typography>
          </View>
        </View>

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
    </View>
  );
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createMetricStyles(theme), [theme]);

  return (
    <View style={styles.metricCard}>
      <Typography style={styles.metricIcon}>{icon}</Typography>
      <Typography variant="caption" color={theme.tertiaryLabel}>
        {label}
      </Typography>
      <Typography variant="body" style={styles.metricValue}>
        {value}
      </Typography>
    </View>
  );
}

function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
      gap: 16,
    },
    navBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.separator,
    },
    navBackButton: {
      width: 40,
      alignItems: 'flex-start',
    },
    navBackIcon: {
      fontSize: 22,
      color: theme.label,
    },
    navTitle: {
      color: theme.label,
      fontSize: 17,
      fontWeight: '600',
      textAlign: 'center',
      flex: 1,
    },
    navShareButton: {
      width: 40,
      alignItems: 'flex-end',
    },
    navShareIcon: {
      fontSize: 20,
      color: theme.label,
    },
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: 24,
      padding: 22,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      gap: 16,
    },
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
      backgroundColor: theme.elevatedBackground,
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
    progressTrack: {
      height: 10,
      backgroundColor: theme.tertiaryBackground,
      borderRadius: 999,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    insightCard: {
      backgroundColor: theme.elevatedBackground,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      gap: 8,
    },
    humorCard: {
      backgroundColor: theme.secondaryBackground,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.cardBorder,
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
      color: theme.label,
      lineHeight: 22,
    },
    warningBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor: theme.errorBackground,
      borderColor: theme.error,
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
    disclaimer: {
      lineHeight: 18,
      textAlign: 'center',
    },
    brandRow: {
      alignItems: 'center',
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flex: 1,
    },
    doneButton: {
      backgroundColor: theme.primary,
    },
  });
}

function createMetricStyles(theme: ThemePalette) {
  return StyleSheet.create({
    metricCard: {
      backgroundColor: theme.elevatedBackground,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 12,
      minWidth: '30%',
      flexGrow: 1,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      gap: 2,
    },
    metricIcon: {
      fontSize: 16,
      marginBottom: 2,
    },
    metricValue: {
      color: theme.label,
      textTransform: 'capitalize',
      fontWeight: '600',
      marginTop: 2,
    },
  });
}
