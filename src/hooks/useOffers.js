import { useState, useEffect, useMemo, useCallback } from 'react';
import { getOffers } from '../api/offersApi.js';

export default function useOffers() {
  const [allOffers, setAllOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOffers();
      setAllOffers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const offers = useMemo(() => {
    let filtered = allOffers;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.offer_config.title?.toLowerCase().includes(q) ||
          o.offer_config.offer_id?.toLowerCase().includes(q) ||
          o.offer_config.marketing_legal?.offer_description_external?.toLowerCase().includes(q) ||
          o.offer_config.template_type?.toLowerCase().includes(q)
      );
    }
    if (typeFilter) {
      filtered = filtered.filter((o) => o.offer_config.template_type === typeFilter);
    }
    return filtered;
  }, [allOffers, search, typeFilter]);

  return { offers, loading, error, refetch: fetchOffers, search, setSearch, typeFilter, setTypeFilter };
}
