import { useState, useEffect, useMemo, useCallback } from 'react';
import { getTemplates } from '../api/templatesApi.js';

export default function useTemplates() {
  const [allTemplates, setAllTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTemplates();
      setAllTemplates(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const activeTemplates = useMemo(() => {
    return allTemplates.filter((t) => t.status === 'active');
  }, [allTemplates]);

  const templates = useMemo(() => {
    if (!categoryFilter) return activeTemplates;
    return activeTemplates.filter((t) => t.category === categoryFilter);
  }, [activeTemplates, categoryFilter]);

  const categories = useMemo(() => {
    return [...new Set(activeTemplates.map((t) => t.category))];
  }, [activeTemplates]);

  return {
    templates,
    allTemplates,
    categories,
    loading,
    error,
    refetch: fetchTemplates,
    categoryFilter,
    setCategoryFilter,
  };
}
