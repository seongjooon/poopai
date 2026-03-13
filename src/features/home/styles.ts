import { StyleSheet } from 'react-native';
import { type ThemePalette } from '@config/theme';

export function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    /* Header */
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 4,
    },
    title: {
      color: theme.label,
      fontSize: 28,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    streakBadge: {
      backgroundColor: theme.warningBackground,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: theme.warning,
    },
    streakText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.warning,
    },
    settingsIcon: {
      fontSize: 22,
    },

    /* Scroll */
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 8,
      gap: 16,
    },

    /* Week Card */
    weekCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },

    /* Score Card */
    scoreCard: {
      backgroundColor: theme.secondaryBackground,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.separator,
      gap: 14,
    },
    scoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    scoreBadge: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
    },
    scoreNumber: {
      fontSize: 28,
      fontWeight: '800',
    },
    scoreLabel: {
      fontSize: 11,
      fontWeight: '600',
      marginTop: -2,
    },
    scoreInfo: {
      flex: 1,
      gap: 3,
    },
    scoreTitle: {
      color: theme.label,
      fontWeight: '700',
      fontSize: 17,
    },
    scoreTime: {
      marginTop: 2,
    },
    insightRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      backgroundColor: theme.background,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.separator,
    },
    insightIcon: {
      fontSize: 14,
      marginTop: 1,
    },
    insightText: {
      flex: 1,
      lineHeight: 18,
    },

    /* Empty State */
    emptyCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 24,
      padding: 32,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.cardBorder,
      gap: 8,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 8,
    },
    emptyTitle: {
      color: theme.label,
      fontWeight: '700',
      fontSize: 18,
    },
    emptySubtitle: {
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 8,
    },
    emptyButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 32,
    },

    /* Recent Scans */
    recentSection: {
      gap: 10,
    },
    sectionTitle: {
      color: theme.label,
      fontWeight: '700',
      fontSize: 17,
    },
    recentList: {
      gap: 8,
    },
    recentCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    recentLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    recentDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    recentScore: {
      color: theme.label,
      fontWeight: '600',
    },

    /* FAB */
    fab: {
      position: 'absolute',
      right: 22,
      bottom: 40,
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.primary,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    fabText: {
      fontSize: 28,
      color: theme.onPrimary,
      fontWeight: '300',
      marginTop: -2,
    },
  });
}
