import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/members';

const mapSortOption = (sortOption) => {
  switch (sortOption) {
    case 'Alphabetical (First Name)':
      return 'firstName:asc';
    case 'Alphabetical (Last Name)':
      return 'lastName:asc';
    case 'Newest First':
      return 'memberCreated:desc';
    case 'Oldest First':
      return 'memberCreated:asc';
    case 'Events: High to Low':
      return 'eventsAttended:desc';
    case 'Events: Low to High':
      return 'eventsAttended:asc';
    default:
      return 'memberCreated:desc';
  }
};

const useFetchMembers = (currentPage, search, sortOption, statusFilters) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const [members, setMembers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          page: currentPage,
          limit: 10,
          q: search || '',
          sort: mapSortOption(sortOption),
        };

        const activeStatuses = (statusFilters || []).filter((s) => s.checked).map((s) => s.name);
        if (activeStatuses.length === 1) params.status = activeStatuses[0];

        const { data } = await axios.get(API_BASE, {
          params,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setMembers(data.items || []);
        setTotalPages(data.pagination?.totalPages || 0);
      } catch (err) {
        console.error('Failed to fetch members', err);
        setMembers([]);
        setTotalPages(0);
      }
    };

    fetchData();
  }, [currentPage, search, sortOption, JSON.stringify(statusFilters), reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  return { members, totalPages, reload };
};

export default useFetchMembers;
