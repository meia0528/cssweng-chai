import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const useFetchSales = (page, search, sortOption, statusFilters) => {
  const [sales, setSales] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [reloadFlag, setReloadFlag] = useState(0);

  const fetchSales = useCallback(async () => {
    try {
      const params = { page, search, sort: sortOption };
      if (statusFilters && statusFilters.length > 0) {
        params.status = statusFilters.map((s) => s.name).join(',');
      }

      const res = await axios.get('http://localhost:5000/sales', { params });

      if (res && res.data) {
        setSales(res.data.sales || res.data.items || []);
        setTotalPages(res.data.totalPages ?? res.data.pages ?? 0);
      } else {
        setSales([]);
        setTotalPages(0);
      }
    } catch (err) {
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
