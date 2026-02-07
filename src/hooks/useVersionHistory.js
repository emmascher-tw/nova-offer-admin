import { useState, useEffect, useCallback } from 'react';
import { getVersionsByOfferId } from '../api/versionsApi.js';

export default function useVersionHistory(offerId) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!offerId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getVersionsByOfferId(offerId);
      setVersions(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [offerId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { versions, loading, error, refetch: fetch };
}
