import { useState } from 'react';
import { supabase } from '@src/lib/supabase';
import { parseAnalysisResult, type AnalysisResult } from './schema';

interface AnalyzeParams {
  imageBase64: string;
}

export function usePoopAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async ({ imageBase64 }: AnalyzeParams): Promise<AnalysisResult> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        'analyze-poop',
        {
          body: { imageBase64 },
        }
      );

      if (invokeError) {
        throw new Error(invokeError.message || 'Analysis failed');
      }

      const parsed = parseAnalysisResult(data);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.from('poop_logs').insert({
            user_id: user.id,
            bristol_type: parsed.bristol_type,
            color: parsed.color,
            color_status: parsed.color_status,
            fragmentation: parsed.fragmentation,
            edge_fuzziness: parsed.edge_fuzziness,
            volume: parsed.volume,
            gut_score: parsed.gut_score,
            health_insight: parsed.health_insight,
            humor_comment: parsed.humor_comment,
            warning: parsed.warning,
            warning_detail: parsed.warning_detail,
          });
        }
      } catch {
        // Non-blocking: analysis UX should still continue even if history persistence fails.
      }

      return parsed;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected analysis error';
      setError(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyze,
    isAnalyzing,
    error,
  };
}
