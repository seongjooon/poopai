import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '@src/ui/atoms';
import type { PoopLog } from './usePoopLogs';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface WeekBarProps {
  logs: PoopLog[];
}

export function WeekBar({ logs }: WeekBarProps) {
  const { days, todayIndex } = useMemo(() => {
    const now = new Date();
    // Monday = 0
    const dayOfWeek = (now.getDay() + 6) % 7;

    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    // Set of date strings that have logs this week
    const logDates = new Set(
      logs.map((l) => {
        const d = new Date(l.created_at);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    );

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      return {
        label: DAY_LABELS[i],
        date: d.getDate(),
        hasLog: logDates.has(key),
        isFuture: d > now,
      };
    });

    return { days: weekDays, todayIndex: dayOfWeek };
  }, [logs]);

  return (
    <View style={styles.container}>
      {days.map((day, i) => {
        const isToday = i === todayIndex;
        return (
          <View key={i} style={styles.dayCol}>
            <Typography
              variant="caption"
              color={isToday ? '#0D3DFF' : '#8B92A1'}
              style={styles.label}
            >
              {day.label}
            </Typography>
            <View
              style={[
                styles.circle,
                isToday && styles.circleToday,
                day.hasLog && styles.circleLogged,
              ]}
            >
              <Typography
                variant="body"
                color={day.hasLog ? '#FFFFFF' : isToday ? '#0D3DFF' : '#C0C6D2'}
                style={styles.dateText}
              >
                {day.date}
              </Typography>
            </View>
            {day.hasLog && <View style={styles.dot} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleToday: {
    borderWidth: 2,
    borderColor: '#0D3DFF',
  },
  circleLogged: {
    backgroundColor: '#0D3DFF',
    borderWidth: 0,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0D3DFF',
  },
});
