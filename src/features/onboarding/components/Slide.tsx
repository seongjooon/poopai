import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@src/ui/atoms';
import { spacing } from '@config/theme';
import { OnboardingStep } from '../schema';

interface SlideProps {
  step: OnboardingStep;
}

export const Slide = ({ step }: SlideProps) => {
  return (
    <View style={styles.container}>
      {/* Image Placeholder */}
      <View style={styles.imagePlaceholder} />

      {/* Content */}
      <View style={styles.content}>
        <Typography variant="h1" style={styles.title}>
          {step.title}
        </Typography>
        <Typography variant="body" style={styles.subtitle}>
          {step.subtitle}
        </Typography>
      </View>
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
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666666',
  },
});
