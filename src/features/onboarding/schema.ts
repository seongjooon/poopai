import { z } from 'zod';

export const OnboardingStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
});

export type OnboardingStep = z.infer<typeof OnboardingStepSchema>;

export const OnboardingContentSchema = z.object({
  onboarding: z.array(OnboardingStepSchema),
});

export type OnboardingContent = z.infer<typeof OnboardingContentSchema>;
