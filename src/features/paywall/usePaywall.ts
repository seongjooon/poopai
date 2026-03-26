import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import Constants from 'expo-constants';
import { usePayments } from '@src/core/payments';
import { PurchasesPackage } from 'react-native-purchases';

// Fallback mock packages when RevenueCat is not configured
export interface MockPackage {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  isPopular?: boolean;
}

const MOCK_PACKAGES: MockPackage[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    period: 'per month',
    isPopular: false,
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$59.99',
    period: 'per year',
    savings: 'Save 50%',
    isPopular: true,
  },
];

export const usePaywall = (onComplete?: () => void) => {
  const { purchasePackage, restorePurchases, isPro, offerings, isLoading, initialize } = usePayments();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trialEligible, setTrialEligible] = useState(true);

  // Initialize payments on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Check trial eligibility from RevenueCat intro pricing
  useEffect(() => {
    const rcPackages = offerings?.current?.availablePackages ?? [];
    if (rcPackages.length > 0) {
      // If any package has intro pricing (free trial), user is eligible
      const hasIntro = rcPackages.some(
        (pkg) => pkg.product.introPrice !== null && pkg.product.introPrice !== undefined
      );
      setTrialEligible(hasIntro);
    }
  }, [offerings]);

  // Get packages from RevenueCat or use mock (dev only)
  const rcPackages = offerings?.current?.availablePackages ?? [];
  const hasRealPackages = rcPackages.length > 0;
  const isExpoGo = Constants.appOwnership === 'expo';
  const allowMockPurchase = __DEV__ || isExpoGo;

  // Convert to unified format for UI
  const packages = hasRealPackages
    ? rcPackages.map((pkg) => ({
        id: pkg.identifier,
        name: pkg.packageType === 'ANNUAL' ? 'Annual' : 'Monthly',
        price: pkg.product.priceString,
        period: pkg.packageType === 'ANNUAL' ? 'per year' : 'per month',
        isPopular: pkg.packageType === 'ANNUAL',
        rcPackage: pkg, // Keep reference for purchase
      }))
    : allowMockPurchase
      ? MOCK_PACKAGES
      : [];

  // Always keep a valid selected package so CTA button is tappable on first render.
  useEffect(() => {
    if (packages.length === 0) {
      if (selectedPackageId) setSelectedPackageId('');
      return;
    }

    const hasSelected = packages.some((p) => p.id === selectedPackageId);
    if (hasSelected) return;

    // Prefer annual plan as default when available, otherwise fallback to first package.
    const preferred =
      packages.find((p) => p.id === 'annual') ??
      packages.find((p) => p.name.toLowerCase().includes('annual')) ??
      packages[0];

    setSelectedPackageId(preferred.id);
  }, [packages, selectedPackageId]);

  const selectPackage = useCallback((id: string) => {
    setSelectedPackageId(id);
  }, []);

  const handlePurchase = useCallback(async () => {
    setErrorMessage(null);

    if (isLoading) {
      Alert.alert('Please wait', 'Preparing purchase options. Please try again in a moment.');
      return;
    }

    const pkg = packages.find((p) => p.id === selectedPackageId);
    if (!pkg) {
      console.warn('[Paywall] Purchase blocked: no selected package', {
        selectedPackageId,
        packageCount: packages.length,
      });
      setErrorMessage('Unable to load subscription plans. Please try again.');
      Alert.alert('Subscription Unavailable', 'Could not load subscription plans. Please tap again in a few seconds.');
      initialize();
      return;
    }

    setIsPurchasing(true);

    try {
      console.log('[Paywall] Purchase started', {
        selectedPackageId,
        hasRealPackages,
        trialEligible,
        allowMockPurchase,
      });

      if (hasRealPackages && 'rcPackage' in pkg) {
        // Real RevenueCat purchase (trial is handled by the store automatically)
        await purchasePackage(pkg.rcPackage as PurchasesPackage);

        const latestIsPro = usePayments.getState().isPro;
        if (!latestIsPro) {
          const message = 'Purchase did not activate Pro entitlement yet. Please wait a few seconds and try Restore Purchases.';
          console.warn('[Paywall] Purchase completed but entitlement inactive', {
            selectedPackageId,
          });
          setErrorMessage(message);
          Alert.alert('Purchase Pending', message);
          return;
        }
      } else if (allowMockPurchase) {
        // Mock purchase for development only
        console.log('[Paywall] Mock purchase:', pkg.id);
      } else {
        const message = 'Subscriptions are temporarily unavailable. Please try again in a few seconds.';
        console.error('[Paywall] Blocking purchase in production: no RevenueCat offerings available');
        setErrorMessage(message);
        Alert.alert('Subscription Unavailable', message);
        initialize();
        return;
      }

      console.log('[Paywall] Purchase flow complete');
      onComplete?.();
    } catch (error: any) {
      console.error('[Paywall] Purchase failed', {
        message: error?.message,
        code: error?.code,
        userCancelled: error?.userCancelled,
        underlyingErrorMessage: error?.underlyingErrorMessage,
      });

      if (!error?.userCancelled) {
        const message = error?.message || 'Purchase failed. Please try again.';
        setErrorMessage(message);
        Alert.alert('Purchase Error', message);
      }
    } finally {
      setIsPurchasing(false);
    }
  }, [
    selectedPackageId,
    packages,
    hasRealPackages,
    purchasePackage,
    onComplete,
    trialEligible,
    isLoading,
    initialize,
    allowMockPurchase,
  ]);

  const handleRestore = useCallback(async () => {
    setIsPurchasing(true);
    setErrorMessage(null);

    try {
      await restorePurchases();
      const latestIsPro = usePayments.getState().isPro;
      console.log('[Paywall] Restore finished', { latestIsPro });

      if (latestIsPro) {
        onComplete?.();
      } else {
        Alert.alert('No Purchases Found', 'We could not find any previous purchases to restore.');
      }
    } catch (error: any) {
      console.error('[Paywall] Restore failed', {
        message: error?.message,
        code: error?.code,
        userCancelled: error?.userCancelled,
        underlyingErrorMessage: error?.underlyingErrorMessage,
      });
      const message = error?.message || 'Restore failed. Please try again.';
      setErrorMessage(message);
      Alert.alert('Restore Error', message);
    } finally {
      setIsPurchasing(false);
    }
  }, [restorePurchases, onComplete]);

  return {
    packages,
    selectedPackageId,
    isPurchasing: isPurchasing || isLoading,
    errorMessage,
    isPro,
    trialEligible,
    selectPackage,
    handlePurchase,
    handleRestore,
  };
};
