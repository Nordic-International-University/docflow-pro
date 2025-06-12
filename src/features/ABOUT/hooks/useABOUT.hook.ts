// ABOUT/hooks/useABOUT.hook.ts
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ABOUTService } from '../services/ABOUT.service';

interface UseABOUTResult {
  data: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  refetch: () => void;
}

export function useABOUT(): UseABOUTResult {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const result = await ABOUTService.getABOUT();
      setData(result);
      setStatus('succeeded');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noma'lum xatolik');
      setStatus('failed');
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, status, error, refetch };
}
