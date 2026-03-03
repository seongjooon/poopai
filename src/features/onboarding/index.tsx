import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '@src/ui/atoms';
import { Slide, DotIndicator } from './components';
import { useOnboarding } from './useOnboarding';
import { spacing, colors } from '@config/theme';

interface OnboardingScreenProps {
  onNavigateToPaywall: () => void;
  onNavigateToMain: () => void;
}

export const OnboardingScreen = ({
  onNavigateToPaywall,
  onNavigateToMain,
}: OnboardingScreenProps) => {
  const {
    steps,
    currentStepIndex,
    currentStep,
    isLastStep,
    isLoading,
    canProceed,
    currentSelection,
    selectOption,
    handleNext,
    skipOnboarding,
  } = useOnboarding(onNavigateToPaywall, onNavigateToMain);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        {!isLastStep && (
          <Button
            title="Skip"
            onPress={skipOnboarding}
            variant="outline"
            disabled={isLoading}
            style={styles.skipButton}
          />
        )}
      </View>

      <View style={styles.slideContainer}>
        <Slide
          step={currentStep}
          selectedOptionId={currentSelection}
          onSelectOption={selectOption}
        />
      </View>

      <View style={styles.indicatorContainer}>
        <DotIndicator totalSteps={steps.length} currentStepIndex={currentStepIndex} />
      </View>

      <View style={styles.bottomContainer}>
        <Button
          title={isLastStep ? 'Start PoopAI' : 'Continue'}
          onPress={handleNext}
          disabled={isLoading || !canProceed}
          loading={isLoading}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topContainer: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    alignItems: 'flex-end',
  },
  skipButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingVertical: spacing.l,
  },
  bottomContainer: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.l,
  },
  nextButton: {
    marginBottom: spacing.s,
  },
});
