import { create } from 'zustand';
import { Platform } from 'react-native';
import { supabase } from '@src/lib/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';
import Purchases from 'react-native-purchases';
import { SECRETS } from '@config/secrets';

// Dynamically load Google Sign-In only on Android to avoid
// RNGoogleSignin native module crash on iOS / Expo Go.
let GoogleSignin: any = null;
if (Platform.OS === 'android') {
  GoogleSignin =
    require('@react-native-google-signin/google-signin').GoogleSignin;
  GoogleSignin.configure({
    webClientId: SECRETS.GOOGLE_WEB_CLIENT_ID,
  });
}

export type User = {
  id: string;
  email?: string;
  isAnonymous: boolean;
};

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  initialize: () => void;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const mapUser = (supabaseUser: any): User | null => {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    isAnonymous: supabaseUser.is_anonymous ?? false,
  };
};

/**
 * Sync RevenueCat subscriber identity with Supabase user ID.
 * This ensures subscription data follows the user across devices.
 */
const syncRevenueCatUser = async (userId: string | null) => {
  if (!userId) return;
  if (SECRETS.REVENUECAT_PUBLIC_KEY === 'appl_PlaceholderKey') return;

  try {
    await Purchases.logIn(userId);
  } catch (error) {
    console.warn('[Auth] RevenueCat logIn failed:', error);
  }
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,

  initialize: () => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = mapUser(session?.user ?? null);
      if (user) {
        await syncRevenueCatUser(user.id);
      }
      set({ user, isLoading: false, isInitialized: true });
    });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = mapUser(session?.user ?? null);
      if (user) {
        await syncRevenueCatUser(user.id);
      }
      set({ user });
    });
  },

  signInWithApple: async () => {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error('No identity token from Apple');
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });

    if (error) throw error;
  },

  signInWithGoogle: async () => {
    if (!GoogleSignin) {
      throw new Error('Google Sign-In is only available on Android');
    }

    await GoogleSignin.hasPlayServices();
    const result = await GoogleSignin.signIn();

    if (!result.data?.idToken) {
      throw new Error('No ID token from Google');
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: result.data.idToken,
    });

    if (error) throw error;
  },

  signInAnonymously: async () => {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Reset RevenueCat to anonymous user
    try {
      await Purchases.logOut();
    } catch (e) {
      // logOut throws if already anonymous, safe to ignore
    }
  },

  deleteAccount: async () => {
    // TODO: Create a Supabase Edge Function that calls
    // supabase.auth.admin.deleteUser(userId) and deletes user data
    console.warn('[Auth] Delete account requires a Supabase Edge Function');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
}));
