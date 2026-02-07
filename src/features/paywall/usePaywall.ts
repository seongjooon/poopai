import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
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
    price: '$79.99',
    period: 'per year',
    savings: 'Save 33%',
    isPopular: true,
  },
];

export const usePaywall = (onComplete?: () => void) => {
  const { purchasePackage, restorePurchases, isPro, offerings, isLoading, initialize } = usePayments();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('annual');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize payments on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Get packages from RevenueCat or use mock
  const rcPackages = offerings?.current?.availablePackages ?? [];
  const hasRealPackages = rcPackages.length > 0;

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
    : MOCK_PACKAGES;

  const selectPackage = useCallback((id: string) => {
    setSelectedPackageId(id);
  }, []);

  const handlePurchase = useCallback(async () => {
    const pkg = packages.find((p) => p.id === selectedPackageId);
    if (!pkg) return;

    setIsPurchasing(true);
    setErrorMessage(null);

    try {
      if (hasRealPackages && 'rcPackage' in pkg) {
        // Real RevenueCat purchase
        await purchasePackage(pkg.rcPackage as PurchasesPackage);
      } else {
        // Mock purchase for development
        console.log('[Paywall] Mock purchase:', pkg.id);
      }
      onComplete?.();
    } catch (error: any) {
      if (!error?.userCancelled) {
        const message = error?.message || 'Purchase failed. Please try again.';
        setErrorMessage(message);
        Alert.alert('Purchase Error', message);
      }
    } finally {
      setIsPurchasing(false);
    }
  }, [selectedPackageId, packages, hasRealPackages, purchasePackage, onComplete]);

  const handleRestore = useCallback(async () => {
    setIsPurchasing(true);
    setErrorMessage(null);

    try {
      await restorePurchases();
      if (isPro) {
        onComplete?.();
      } else {
        Alert.alert('No Purchases Found', 'We could not find any previous purchases to restore.');
      }
    } catch (error: any) {
      const message = error?.message || 'Restore failed. Please try again.';
      setErrorMessage(message);
      Alert.alert('Restore Error', message);
    } finally {
      setIsPurchasing(false);
    }
  }, [restorePurchases, isPro, onComplete]);

  return {
    packages,
    selectedPackageId,
    isPurchasing: isPurchasing || isLoading,
    errorMessage,
    isPro,
    selectPackage,
    handlePurchase,
    handleRestore,
  };
};
