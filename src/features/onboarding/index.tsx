import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@src/ui/atoms';
import { Slide, DotIndicator } from './components';
import { useOnboarding } from './useOnboarding';
import { spacing, useTheme, type ThemePalette } from '@config/theme';

interface OnboardingScreenProps {
  onNavigateToPaywall: () => void;
  onNavigateToMain: () => void;
}

export const OnboardingScreen = ({
  onNavigateToPaywall,
  onNavigateToMain,
}: OnboardingScreenProps) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

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

function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
}
