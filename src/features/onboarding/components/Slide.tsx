import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from '@src/ui/atoms';
import { spacing } from '@config/theme';
import { OnboardingStep } from '../schema';

interface SlideProps {
  step: OnboardingStep;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
}

export const Slide = ({ step, selectedOptionId, onSelectOption }: SlideProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.previewCard}>
        <Typography style={styles.previewEmoji}>
          {step.kind === 'finish' ? '✅' : '💩'}
        </Typography>
        <Typography variant="caption" color="#5E6677">
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
                  color={selected ? '#0D3DFF' : '#121722'}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
  },
  previewCard: {
    width: 220,
    height: 220,
    backgroundColor: '#F6F8FF',
    borderRadius: 28,
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3E9FF',
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
    color: '#121722',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666D7A',
    lineHeight: 22,
  },
  optionsContainer: {
    width: '100%',
    gap: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#E2E8F6',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  optionButtonSelected: {
    borderColor: '#0D3DFF',
    backgroundColor: '#EEF3FF',
  },
  optionLabel: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
