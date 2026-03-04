import React, { useState } from 'react';
import { Alert } from 'react-native';
import { CameraScreen } from './CameraScreen';
import { LoadingScreen } from './LoadingScreen';
import { ResultCard } from './ResultCard';
import { usePoopAnalysis } from './usePoopAnalysis';
import type { AnalysisResult } from './schema';

type FlowStep = 'camera' | 'loading' | 'result';

export function PoopLogScreen() {
  const [step, setStep] = useState<FlowStep>('camera');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { analyze } = usePoopAnalysis();

  const handleCaptured = async (imageBase64: string) => {
    setStep('loading');

    try {
      const analysisResult = await analyze({ imageBase64 });
      setResult(analysisResult);
      setStep('result');
    } catch (error) {
      setStep('camera');
      const detail = error instanceof Error ? error.message : String(error);
      Alert.alert(
        'Analysis failed',
        __DEV__
          ? `${detail}`
          : 'We could not analyze this photo. Please retake and try again.'
      );
    }
  };

  const resetFlow = () => {
    setResult(null);
    setStep('camera');
  };

  if (step === 'loading') {
    return <LoadingScreen />;
  }

  if (step === 'result' && result) {
    return <ResultCard result={result} onRetake={resetFlow} />;
  }

  return <CameraScreen onCaptured={handleCaptured} />;
}
