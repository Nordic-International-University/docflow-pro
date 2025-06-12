// signup/hooks/useSignup.hook.ts
import { useState, useEffect } from 'react';

interface UseSignupResult {
  data: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export function useSignup(): UseSignupResult {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);

  return { data, status, error };
}
