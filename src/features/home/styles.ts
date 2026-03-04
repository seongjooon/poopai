import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: '#121722',
    fontSize: 28,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    backgroundColor: '#FFF4EC',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FFE4CC',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8730E',
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
    backgroundColor: '#F8F9FD',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ECEEF5',
  },

  /* Score Card */
  scoreCard: {
    backgroundColor: '#F4F6FB',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5EAF7',
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
    backgroundColor: '#FFFFFF',
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
    color: '#121722',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8ECF4',
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
    backgroundColor: '#F8F9FD',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEEF5',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    color: '#121722',
    fontWeight: '700',
    fontSize: 18,
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  emptyButton: {
    backgroundColor: '#0D3DFF',
    paddingHorizontal: 32,
  },

  /* Recent Scans */
  recentSection: {
    gap: 10,
  },
  sectionTitle: {
    color: '#121722',
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
    backgroundColor: '#F8F9FD',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECEEF5',
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
    color: '#121722',
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
    backgroundColor: '#0D3DFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D3DFF',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -2,
  },
});
