import { useMemo, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRemoteConfig } from '@src/core/remote-config';
import { Analytics } from '@src/core/analytics';
import contents from '@config/contents.json';
import { OnboardingStepSchema } from './schema';

const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';
const ONBOARDING_PROFILE_KEY = 'onboarding_profile';

export const useOnboarding = (
  onNavigateToPaywall: () => void,
  onNavigateToMain: () => void
) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const remoteConfig = useRemoteConfig();

  const steps = useMemo(
    () => contents.onboarding.map((step) => OnboardingStepSchema.parse(step)),
    []
  );

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  // Track onboarding start & step views
  useEffect(() => {
    if (currentStepIndex === 0) {
      Analytics.trackOnboardingStarted();
    }
    Analytics.trackOnboardingStepViewed(currentStepIndex, currentStep.id);
  }, [currentStepIndex, currentStep.id]);

  const currentSelection = answers[currentStep.id];
  const canProceed =
    !currentStep.required ||
    currentStep.kind !== 'single_select' ||
    Boolean(currentSelection);

  const selectOption = useCallback((optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep.id]: optionId }));
  }, [currentStep.id]);

  const handleNext = useCallback(async () => {
    if (!canProceed) return;

    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.multiSet([
        [ONBOARDING_COMPLETED_KEY, 'true'],
        [ONBOARDING_PROFILE_KEY, JSON.stringify(answers)],
      ]);

      Analytics.trackOnboardingCompleted(answers);

      if (remoteConfig.showPaywallOnboarding) {
        onNavigateToPaywall();
      } else {
        onNavigateToMain();
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsLoading(false);
    }
  }, [
    canProceed,
    isLastStep,
    answers,
    remoteConfig.showPaywallOnboarding,
    onNavigateToPaywall,
    onNavigateToMain,
  ]);

  const skipOnboarding = useCallback(async () => {
    setIsLoading(true);
    try {
      Analytics.trackOnboardingSkipped(currentStepIndex);
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      onNavigateToMain();
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      setIsLoading(false);
    }
  }, [onNavigateToMain]);

  return {
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
  };
};
