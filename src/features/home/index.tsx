import React, { useMemo } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Typography, Button } from '@src/ui/atoms';
import { usePoopLogs } from './usePoopLogs';
import { calcStreak } from './useStreak';
import { WeekBar } from './WeekBar';
import { styles } from './styles';

const SCAN_INTRO_SEEN_KEY = 'scan_intro_seen';

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

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `Today ${time}`;
  if (isYesterday) return `Yesterday ${time}`;
  return `${d.getMonth() + 1}/${d.getDate()} ${time}`;
}

export function HomeScreen() {
  const router = useRouter();
  const { logs, isLoading, refetch } = usePoopLogs();

  const streak = useMemo(() => calcStreak(logs), [logs]);
  const latestLog = logs.length > 0 ? logs[0] : null;
  const recentLogs = logs.slice(0, 5);

  const handleScanPress = async () => {
    try {
      const seen = await AsyncStorage.getItem(SCAN_INTRO_SEEN_KEY);
      if (seen === 'true') {
        router.push('/poop-log');
      } else {
        router.push('/scan-intro');
      }
    } catch {
      Alert.alert('Error', 'Could not open scanner.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Typography variant="h1" style={styles.title}>PoopAI</Typography>
        </View>
        <View style={styles.headerRight}>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Typography style={styles.streakText}>🔥 {streak}</Typography>
            </View>
          )}
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Typography style={styles.settingsIcon}>⚙️</Typography>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#0D3DFF" />
        }
      >
        {/* Week Bar */}
        <View style={styles.weekCard}>
          <WeekBar logs={logs} />
        </View>

        {/* Latest Score Card */}
        {latestLog ? (
          <View style={styles.scoreCard}>
            <View style={styles.scoreRow}>
              <View style={[styles.scoreBadge, { borderColor: scoreColor(latestLog.gut_score) }]}>
                <Typography color={scoreColor(latestLog.gut_score)} style={styles.scoreNumber}>
                  {latestLog.gut_score}
                </Typography>
                <Typography
                  variant="caption"
                  color={scoreColor(latestLog.gut_score)}
                  style={styles.scoreLabel}
                >
                  {scoreLabel(latestLog.gut_score)}
                </Typography>
              </View>
              <View style={styles.scoreInfo}>
                <Typography variant="body" style={styles.scoreTitle}>
                  Latest Gut Score
                </Typography>
                <Typography variant="caption" color="#8B92A1">
                  Bristol Type {latestLog.bristol_type} · {latestLog.color}
                </Typography>
                <Typography variant="caption" color="#5D6472" style={styles.scoreTime}>
                  {formatTime(latestLog.created_at)}
                </Typography>
              </View>
            </View>
            <View style={styles.insightRow}>
              <Typography style={styles.insightIcon}>💡</Typography>
              <Typography variant="caption" color="#B5B8C3" style={styles.insightText}>
                {latestLog.health_insight}
              </Typography>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Typography style={styles.emptyIcon}>💩</Typography>
            <Typography variant="body" style={styles.emptyTitle}>
              No scans yet
            </Typography>
            <Typography variant="caption" color="#8B92A1" style={styles.emptySubtitle}>
              Take your first scan to see your gut health insights
            </Typography>
            <Button
              title="Start First Scan"
              onPress={handleScanPress}
              style={styles.emptyButton}
            />
          </View>
        )}

        {/* Recent Scans */}
        {recentLogs.length > 0 && (
          <View style={styles.recentSection}>
            <Typography variant="body" style={styles.sectionTitle}>
              Recent Scans
            </Typography>
            <View style={styles.recentList}>
              {recentLogs.map((log) => (
                <View key={log.id} style={styles.recentCard}>
                  <View style={styles.recentLeft}>
                    <View
                      style={[
                        styles.recentDot,
                        { backgroundColor: scoreColor(log.gut_score) },
                      ]}
                    />
                    <View>
                      <Typography variant="body" style={styles.recentScore}>
                        Score {log.gut_score}
                      </Typography>
                      <Typography variant="caption" color="#8B92A1">
                        Type {log.bristol_type} · {log.color}
                      </Typography>
                    </View>
                  </View>
                  <Typography variant="caption" color="#5D6472">
                    {formatTime(log.created_at)}
                  </Typography>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom spacing for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleScanPress}
        activeOpacity={0.85}
      >
        <Typography style={styles.fabText}>＋</Typography>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
