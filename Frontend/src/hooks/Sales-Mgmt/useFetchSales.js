import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const useFetchSales = (page, search, sortOption, statusFilters) => {
  const [sales, setSales] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [reloadFlag, setReloadFlag] = useState(0);

  // Map sort label to backend format
  const mapSortOption = (label) => {
    switch (label) {
      case 'Newest First':
        return 'createdAt:desc';
      case 'Oldest First':
        return 'createdAt:asc';
      case 'Total: High to Low':
        return 'total:desc';
      case 'Total: Low to High':
        return 'total:asc';
      default:
        return 'createdAt:desc';
    }
  };

  const fetchSales = useCallback(async () => {
    try {
      const params = { page, search, sort: mapSortOption(sortOption) };
      if (statusFilters && statusFilters.length > 0) {
        params.status = statusFilters.map((s) => s.name).join(',');
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get('http://localhost:5000/sales', { params, headers });

      if (res && res.data) {
        setSales(res.data.sales || res.data.items || []);
        setTotalPages(res.data.totalPages ?? res.data.pages ?? 0);
      } else {
        setSales([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error('Failed to fetch sales:', err?.response?.status, err?.message || err);
      setSales([]);
      setTotalPages(0);
    }
  }, [page, search, sortOption, statusFilters, reloadFlag]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const reload = () => setReloadFlag((r) => r + 1);

  return { sales, totalPages, reload };
};

export default useFetchSales;
