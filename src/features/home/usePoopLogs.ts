import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@src/lib/supabase';

export interface PoopLog {
  id: string;
  bristol_type: number;
  color: string;
  gut_score: number;
  health_insight: string;
  humor_comment: string;
  warning: boolean;
  created_at: string;
}

export function usePoopLogs() {
  const [logs, setLogs] = useState<PoopLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLogs([]);
        return;
      }

      const { data, error } = await supabase
        .from('poop_logs')
        .select('id, bristol_type, color, gut_score, health_insight, humor_comment, warning, created_at')
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) {
        console.error('[usePoopLogs] fetch error:', error.message);
        return;
      }

      setLogs(data ?? []);
    } catch (err) {
      console.error('[usePoopLogs] unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, isLoading, refetch: fetchLogs };
}
