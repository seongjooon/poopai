import { create } from 'zustand';
import { Platform } from 'react-native';
import Purchases, {
  PurchasesOfferings,
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import { SECRETS } from '@config/secrets';

// Initialize RevenueCat - call this at app launch
export const configurePayments = async () => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    if (SECRETS.REVENUECAT_PUBLIC_KEY === 'appl_PlaceholderKey') {
      console.warn('[Payments] RevenueCat key is placeholder. Purchases will not work.');
      return;
    }
    try {
      Purchases.configure({ apiKey: SECRETS.REVENUECAT_PUBLIC_KEY });
    } catch (error) {
      console.warn("[Payments] Error configuring Purchases:", error);
    }
  }
};

interface PaymentState {
  isPro: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOfferings | null;
  initialize: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const checkEntitlement = (customerInfo: CustomerInfo | null): boolean => {
  if (!customerInfo) return false;
  // Check for "pro" or "premium" entitlement - adjust to match your RevenueCat setup
  return (
    customerInfo.entitlements.active['pro'] !== undefined ||
    customerInfo.entitlements.active['premium'] !== undefined
  );
};

export const usePayments = create<PaymentState>((set, get) => ({
  isPro: false,
  isLoading: false,
  customerInfo: null,
  offerings: null,

  initialize: async () => {
    if (SECRETS.REVENUECAT_PUBLIC_KEY === 'appl_PlaceholderKey') {
      console.warn('[Payments] Skipping initialization - placeholder key');
      return;
    }

    set({ isLoading: true });
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const offerings = await Purchases.getOfferings();

      set({
        customerInfo,
        offerings,
        isPro: checkEntitlement(customerInfo),
        isLoading: false,
      });

      // Listen for customer info updates
      Purchases.addCustomerInfoUpdateListener((info) => {
        set({ customerInfo: info, isPro: checkEntitlement(info) });
      });
    } catch (error) {
      console.error('[Payments] Init error:', error);
      set({ isLoading: false });
    }
  },

  purchasePackage: async (pkg: PurchasesPackage) => {
    set({ isLoading: true });
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const proActive = checkEntitlement(customerInfo);
      set({
        customerInfo,
        isPro: proActive,
        isLoading: false,
      });
      console.log('[Payments] Purchase success', {
        packageIdentifier: pkg.identifier,
        productIdentifier: pkg.product.identifier,
        proActive,
      });
    } catch (error: any) {
      console.error('[Payments] Purchase error', {
        message: error?.message,
        code: error?.code,
        userCancelled: error?.userCancelled,
        underlyingErrorMessage: error?.underlyingErrorMessage,
      });
      set({ isLoading: false });
      throw error;
    }
  },

  restorePurchases: async () => {
    set({ isLoading: true });
    try {
      const customerInfo = await Purchases.restorePurchases();
      const proActive = checkEntitlement(customerInfo);
      set({
        customerInfo,
        isPro: proActive,
        isLoading: false,
      });
      console.log('[Payments] Restore complete', { proActive });
    } catch (error: any) {
      console.error('[Payments] Restore error', {
        message: error?.message,
        code: error?.code,
        userCancelled: error?.userCancelled,
        underlyingErrorMessage: error?.underlyingErrorMessage,
      });
      set({ isLoading: false });
      throw error;
    }
  },
}));

// Helper for simple checks
export const useProStatus = () => usePayments((state) => state.isPro);
