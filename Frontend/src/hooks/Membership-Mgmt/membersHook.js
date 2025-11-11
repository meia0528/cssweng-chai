import { useEffect, useMemo, useState } from 'react';

// Temporary client-side store to keep the UI working while backend endpoints are wired.
// Swap implementations later to call your real API (e.g., http://localhost:5000/members).

const PAGE_SIZE = 10;

const initialSeed = [
  // Minimal seed so the page renders something; safe to remove later
  { _id: 'seed-1', fullName: 'Alice Example', email: 'alice@example.com', phoneNumber: '555-1001', membershipStatus: 'Pending', notes: '' },
  { _id: 'seed-2', fullName: 'Bob Active', email: 'bob@example.com', phoneNumber: '555-1002', membershipStatus: 'Active', notes: 'Donor' },
  { _id: 'seed-3', fullName: 'Cara Inactive', email: 'cara@example.com', phoneNumber: '555-1003', membershipStatus: 'Inactive', notes: '' },
];

function useMembers() {
  const [members, setMembers] = useState(initialSeed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters and pagination
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // Derived filtered list
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return members.filter((m) => {
      const matchQ = !qLower || (
        m.fullName?.toLowerCase().includes(qLower) || m.email?.toLowerCase().includes(qLower)
      );
      const matchStatus = !status || m.membershipStatus === status;
      return matchQ && matchStatus;
    });
  }, [members, q, status]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  // Simulate async fetch on filter/page change (replace with real API later)
  useEffect(() => {
    setLoading(true);
    setError('');
    const timer = setTimeout(() => {
      setLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [q, status, currentPage]);

  const createMember = async (payload) => {
    try {
      setLoading(true);
      // Replace with POST /api/members later
      const _id = `local-${Date.now()}`;
      setMembers((prev) => [{ _id, ...payload }, ...prev]);
    } catch (e) {
      setError('Failed to create member');
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id) => {
    try {
      setLoading(true);
      // Replace with DELETE /api/members/:id later
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (e) {
      setError('Failed to delete member');
    } finally {
      setLoading(false);
    }
  };

  return {
    members: paged,
    loading,
    error,
    pagination: { page: currentPage, limit: PAGE_SIZE, total: filtered.length, totalPages },
    page: currentPage,
    setPage,
    q,
    setQ,
    status,
    setStatus,
    createMember,
    deleteMember,
  };
}

export default useMembers;
