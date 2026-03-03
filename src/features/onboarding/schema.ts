import { z } from 'zod';

export const OnboardingOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const OnboardingStepSchema = z.object({
  id: z.string(),
  kind: z.enum(['intro', 'single_select', 'finish']),
  title: z.string(),
  subtitle: z.string(),
  required: z.boolean().optional().default(false),
  options: z.array(OnboardingOptionSchema).optional(),
});

export type OnboardingOption = z.infer<typeof OnboardingOptionSchema>;
export type OnboardingStep = z.infer<typeof OnboardingStepSchema>;

export const OnboardingContentSchema = z.object({
  onboarding: z.array(OnboardingStepSchema),
});

export type OnboardingContent = z.infer<typeof OnboardingContentSchema>;
