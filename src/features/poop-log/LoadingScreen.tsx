import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Typography } from '@src/ui/atoms';

const LOADING_LINES = [
  'Analyzing your masterpiece...',
  'Consulting the gut experts...',
  'Reading between the lines...',
  'Checking your gut vibes...',
  'Decoding your poop data...',
];

export function LoadingScreen() {
  const spinValue = useRef(new Animated.Value(0)).current;

  const line = useMemo(
    () => LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)],
    []
  );

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.emoji, { transform: [{ rotate }] }]}>💩</Animated.Text>
      <Typography variant="h1" style={styles.title}>
        Analyzing...
      </Typography>
      <Typography variant="body" color="#B5B8C3" style={styles.subtitle}>
        {line}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D0F14',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
});
