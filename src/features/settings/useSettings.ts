import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { useAuth } from '@src/core/auth';
import { usePayments } from '@src/core/payments';
import { useRemoteConfig } from '@src/core/remote-config';

export const useSettings = () => {
  const { user, signInWithApple, signOut, deleteAccount } = useAuth();
  const { restorePurchases, isPro } = usePayments();
  const remoteConfig = useRemoteConfig();

  const handleSignIn = useCallback(async () => {
    try {
      await signInWithApple();
    } catch (error) {
      Alert.alert('Sign In Failed', 'Could not sign in with Apple');
      console.error('Sign in error:', error);
    }
  }, [signInWithApple]);

  const handleSignOut = useCallback(async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert('Sign Out Failed', 'Could not sign out');
            console.error('Sign out error:', error);
          }
        },
        style: 'destructive',
      },
    ]);
  }, [signOut]);

  const handleDeleteAccount = useCallback(async () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteAccount();
              Alert.alert(
                'Account Deleted',
                'Your account has been successfully deleted.'
              );
            } catch (error) {
              Alert.alert('Deletion Failed', 'Could not delete your account');
              console.error('Delete account error:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  }, [deleteAccount]);

  const handleRestorePurchases = useCallback(async () => {
    try {
      await restorePurchases();
      Alert.alert('Success', 'Purchases restored successfully');
    } catch (error: any) {
      const message = error?.message || 'Could not restore purchases';
      Alert.alert('Restore Failed', message);
      console.error('Restore purchases error:', error);
    }
  }, [restorePurchases]);

  const openURL = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open the URL');
    });
  }, []);

  const sendEmail = useCallback(() => {
    const email = 'support@example.com';
    const subject = 'Contact Support';
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    Linking.openURL(mailto).catch(() => {
      Alert.alert(
        'Error',
        `Could not open email. Please contact us at ${email}`
      );
    });
  }, []);

  return {
    user,
    isPro,
    isReviewMode: remoteConfig.isReviewMode,
    handleSignIn,
    handleSignOut,
    handleDeleteAccount,
    handleRestorePurchases,
    openURL,
    sendEmail,
  };
};
