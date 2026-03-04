import { Mixpanel } from 'mixpanel-react-native';
import { SECRETS } from '@config/secrets';

// Mixpanel instance - initialized lazily
let mixpanel: Mixpanel | null = null;

const isConfigured = () => SECRETS.MIXPANEL_TOKEN !== 'your-mixpanel-token';

export const Analytics = {
  initialize: async () => {
    if (!isConfigured()) {
      console.warn('[Analytics] Mixpanel token is placeholder. Analytics disabled.');
      return;
    }

    try {
      mixpanel = new Mixpanel(SECRETS.MIXPANEL_TOKEN, true);
      await mixpanel.init();
      console.log('[Analytics] Mixpanel initialized');
    } catch (error) {
      console.error('[Analytics] Init error:', error);
    }
  },

  track: (event: string, properties?: Record<string, any>) => {
    if (!mixpanel) {
      console.log(`[Analytics] Event (disabled): ${event}`, properties);
      return;
    }
    mixpanel.track(event, properties);
  },

  screen: (screenName: string) => {
    if (!mixpanel) {
      console.log(`[Analytics] Screen (disabled): ${screenName}`);
      return;
    }
    mixpanel.track('Screen View', { screen_name: screenName });
  },

  identify: (userId: string) => {
    if (!mixpanel) {
      console.log(`[Analytics] Identify (disabled): ${userId}`);
      return;
    }
    mixpanel.identify(userId);
  },

  setUserProperties: (properties: Record<string, any>) => {
    if (!mixpanel) return;
    mixpanel.getPeople().set(properties);
  },

  reset: () => {
    if (!mixpanel) return;
    mixpanel.reset();
  },

  // Convenience methods for common events
  trackPurchase: (packageId: string, price: string) => {
    Analytics.track('Purchase', { package_id: packageId, price });
  },

  trackSignUp: (method: 'apple' | 'google' | 'guest') => {
    Analytics.track('Sign Up', { method });
  },

  // ── Onboarding funnel ──
  trackOnboardingStarted: () => {
    Analytics.track('Onboarding Started');
  },

  trackOnboardingStepViewed: (stepIndex: number, stepId: string) => {
    Analytics.track('Onboarding Step Viewed', { step_index: stepIndex, step_id: stepId });
  },

  trackOnboardingCompleted: (answers?: Record<string, string>) => {
    Analytics.track('Onboarding Completed', answers);
  },

  trackOnboardingSkipped: (atStepIndex: number) => {
    Analytics.track('Onboarding Skipped', { at_step_index: atStepIndex });
  },

  // ── Scan funnel ──
  trackScanIntroViewed: () => {
    Analytics.track('Scan Intro Viewed');
  },

  trackCameraOpened: () => {
    Analytics.track('Camera Opened');
  },

  trackPhotoCaptured: () => {
    Analytics.track('Photo Captured');
  },

  trackAnalysisStarted: () => {
    Analytics.track('Analysis Started');
  },

  trackAnalysisCompleted: (gutScore: number, bristolType: number, warning: boolean) => {
    Analytics.track('Analysis Completed', {
      gut_score: gutScore,
      bristol_type: bristolType,
      warning,
    });
  },

  trackAnalysisFailed: (error: string) => {
    Analytics.track('Analysis Failed', { error });
  },

  trackResultShared: () => {
    Analytics.track('Result Shared');
  },

  // Legacy alias
  trackOnboardingComplete: () => {
    Analytics.track('Onboarding Completed');
  },
};
