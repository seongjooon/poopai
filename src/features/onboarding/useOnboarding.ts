import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRemoteConfig } from '@src/core/remote-config';
import contents from '@config/contents.json';
import { OnboardingStepSchema } from './schema';

const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

export const useOnboarding = (onNavigateToPaywall: () => void, onNavigateToMain: () => void) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const remoteConfig = useRemoteConfig();

  // Validate and load onboarding steps from config
  const steps = contents.onboarding.map((step) => OnboardingStepSchema.parse(step));

  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = useCallback(async () => {
    if (!isLastStep) {
      // Move to next step
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Last step completed - check if paywall should be shown
      setIsLoading(true);
      try {
        // Always mark onboarding as completed before navigating away
        await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');

        if (remoteConfig.showPaywallOnboarding) {
          onNavigateToPaywall();
        } else {
          onNavigateToMain();
        }
      } catch (error) {
        console.error('Error completing onboarding:', error);
        setIsLoading(false);
      }
    }
  }, [isLastStep, remoteConfig.showPaywallOnboarding, onNavigateToPaywall, onNavigateToMain]);

  const skipOnboarding = useCallback(async () => {
    setIsLoading(true);
    try {
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
    currentStep: steps[currentStepIndex],
    isLastStep,
    isLoading,
    handleNext,
    skipOnboarding,
  };
};
