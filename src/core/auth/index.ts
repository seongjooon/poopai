import { create } from 'zustand';
import { Platform } from 'react-native';
import { supabase } from '@src/lib/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';
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

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: mapUser(session?.user ?? null), isLoading: false });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: mapUser(session?.user ?? null) });
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
  },

  deleteAccount: async () => {
    // TODO: Create a Supabase Edge Function that calls
    // supabase.auth.admin.deleteUser(userId) and deletes user data
    console.warn('[Auth] Delete account requires a Supabase Edge Function');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
}));
