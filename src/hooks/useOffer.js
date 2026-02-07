import { useState, useEffect } from 'react';
import { getOffer } from '../api/offersApi.js';

export default function useOffer(id) {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getOffer(id)
      .then(setOffer)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { offer, loading, error };
}
