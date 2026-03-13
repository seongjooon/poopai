import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from '@src/ui/atoms';
import { spacing, useTheme, type ThemePalette } from '@config/theme';
import { OnboardingStep } from '../schema';

interface SlideProps {
  step: OnboardingStep;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
}

export const Slide = ({ step, selectedOptionId, onSelectOption }: SlideProps) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.previewCard}>
        <Typography style={styles.previewEmoji}>
          {step.kind === 'finish' ? '✅' : '💩'}
        </Typography>
        <Typography variant="caption" color={theme.secondaryLabel}>
          PoopAI
        </Typography>
      </View>

      <View style={styles.content}>
        <Typography variant="h1" style={styles.title}>
          {step.title}
        </Typography>
        <Typography variant="body" style={styles.subtitle}>
          {step.subtitle}
        </Typography>
      </View>

      {step.kind === 'single_select' && step.options && (
        <View style={styles.optionsContainer}>
          {step.options.map((option) => {
            const selected = selectedOptionId === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => onSelectOption(option.id)}
                style={[styles.optionButton, selected && styles.optionButtonSelected]}
              >
                <Typography
                  variant="body"
                  color={selected ? theme.primary : theme.label}
                  style={styles.optionLabel}
                >
                  {option.label}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.l,
    },
    previewCard: {
      width: 220,
      height: 220,
      backgroundColor: theme.cardBackground,
      borderRadius: 28,
      marginBottom: spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    previewEmoji: {
      fontSize: 54,
      marginBottom: 8,
    },
    content: {
      alignItems: 'center',
      marginBottom: spacing.l,
    },
    title: {
      marginBottom: spacing.s,
      textAlign: 'center',
      color: theme.label,
    },
    subtitle: {
      textAlign: 'center',
      color: theme.secondaryLabel,
      lineHeight: 22,
    },
    optionsContainer: {
      width: '100%',
      gap: 10,
    },
    optionButton: {
      borderWidth: 1,
      borderColor: theme.separator,
      backgroundColor: theme.background,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 14,
    },
    optionButtonSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.accentBackground,
    },
    optionLabel: {
      textAlign: 'center',
      fontWeight: '600',
    },
  });
}
