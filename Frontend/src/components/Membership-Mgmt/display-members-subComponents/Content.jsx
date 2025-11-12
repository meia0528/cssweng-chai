import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import useFetchMembers from '../../../hooks/Membership-Mgmt/useFetchMembers.js';
import EditMemberModal from '../EditMemberModal.jsx';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
};

const confirmModalStyle = {
  width: 'min(480px, 92vw)',
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
  padding: 20,
};

const badgeStyle = (status) => {
  switch (status) {
    case 'Active':
      return { background: '#28a745', color: '#fff' };
    case 'Pending':
      return { background: '#ffc107', color: '#212529' };
    case 'Expired':
      return { background: '#dc3545', color: '#fff' };
    default:
      return { background: '#6c757d', color: '#fff' };
  }
};

const Content = ({ search, setSearch, sortOption, statusFilters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { members, totalPages, reload } = useFetchMembers(currentPage, search, sortOption, statusFilters);
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  
  const mapSortOption = (sortOption) => {
    switch (sortOption) {
      case 'Alphabetical (First, Last)':
      case 'Alphabetical':
        return 'name:asc';
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

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const formattedMembers = useMemo(() => {
    return members.map((m) => ({
      ...m,
      displayName: [m.firstName, m.lastName].filter(Boolean).join(' ').trim(),
      createdDisplay: m.memberCreated ? new Date(m.memberCreated).toLocaleDateString() : '',
    }));
  }, [members]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const incrementEvents = async (member) => {
    try {
      const next = (member.eventsAttended ?? 0) + 1;
      const res = await axios.put(
        `http://localhost:5000/members/${member._id}`,
        { eventsAttended: next },
        { headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' } }
      );
      const updated = res?.data;
      if (member.membershipStatus === 'Pending' && updated?.membershipStatus === 'Active') {
        const first = member.firstName || updated?.firstName || 'Member';
        setToast(`${first} promoted to Active`);
      }
      reload();
    } catch (err) {
      console.error('Failed to increment events', err);
    }
  };

  const [pendingDelete, setPendingDelete] = useState(null);

  const requestDelete = (member) => {
    setPendingDelete(member);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await axios.delete(`http://localhost:5000/members/${pendingDelete._id}` , {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPendingDelete(null);
      reload();
    } catch (err) {
      console.error('Failed to delete member', err);
    }
  };

  const cancelDelete = () => setPendingDelete(null);

  // CSV download moved to left panel (Filtering)

  return (
    <>
    <main className="displayAllProducts">
      {toast ? (
        <div role="status" aria-live="polite" className="membership-toast">
          {toast}
        </div>
      ) : null}
      <div className="membership-main-area">
        <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
          <div className="search-bar-section">
            <input
              className="search-bar"
              type="text"
              placeholder="Search first/last name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
        </form>

        <div style={{ marginTop: 24 }}>
          <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead style={{ background: '#f7f7f7' }}>
              <tr>
                <th style={{ width: '18%' }}>Name</th>
                <th style={{ width: '22%' }}>Email</th>
                <th style={{ width: '14%' }}>Phone</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '12%' }}>Events</th>
                <th style={{ width: '16%' }}>Member Since</th>
                <th style={{ width: '6%' }}>Edit</th>
                <th style={{ width: '6%' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {formattedMembers.map((m) => (
                <tr key={m._id}>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.displayName || '(No name)'}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.phoneNumber || ''}</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <span
                      style={{
                        ...badgeStyle(m.membershipStatus),
                        padding: '2px 10px',
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    >
                      {m.membershipStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span>{m.eventsAttended ?? 0}</span>
                    <button
                      title="Increment events"
                      onClick={() => incrementEvents(m)}
                      style={{
                        marginLeft: 8,
                        padding: '2px 8px',
                        borderRadius: 12,
                        border: '1px solid #ccc',
                        background: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </td>
                  <td>{m.createdDisplay}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="membership-edit-btn"
                      aria-label={`Edit ${m.displayName || 'member'}`}
                      title="Edit member"
                      onClick={() => setEditing(m)}
                    >
                      <img src="/img/Membership-Mgmt/edit.png" alt="Edit" />
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="membership-delete-btn"
                      aria-label={`Delete ${m.displayName || 'member'}`}
                      title="Delete member"
                      onClick={() => requestDelete(m)}
                    >
                      <img src="/img/Product-Mgmt/product-overview/delete.png" alt="Delete" />
                    </button>
                  </td>
                </tr>
              ))}
              {formattedMembers.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center' }}>
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="navigation-area" style={{ marginTop: 16 }}>
          <div></div>

          <div>
            <button className="nav-button" onClick={() => goToPage(currentPage - 1)}>
              &lt;
            </button>
            <button className={`round-button`}>{totalPages > 0 ? currentPage : '0'}</button>
            <button className="nav-button" onClick={() => goToPage(currentPage + 1)}>
              &gt;
            </button>
          </div>

          <div>
            <p className="page-summary">
              {totalPages > 0 ? currentPage : '0'} / {totalPages}{' '}
              {totalPages > 1 ? 'pages' : 'page'}
            </p>
          </div>
        </div>
      </div>
    </main>
    {editing ? (
      <EditMemberModal
        member={editing}
        onClose={() => setEditing(null)}
        onSaved={() => reload()}
        token={token}
      />
    ) : null}
    {pendingDelete ? (
      <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Confirm delete member">
        <section style={confirmModalStyle}>
          <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>
          <p style={{ lineHeight: 1.4 }}>
            Are you sure you want to delete{' '}
            <strong>{[pendingDelete.firstName, pendingDelete.lastName].filter(Boolean).join(' ') || 'this member'}</strong>?<br />
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button type="button" className="member-cancel-btn" onClick={cancelDelete}>Cancel</button>
            <button
              type="button"
              className="member-submit-btn"
              onClick={confirmDelete}
              style={{ background: '#dc3545', borderColor: '#dc3545' }}
            >
              Delete
            </button>
          </div>
        </section>
      </div>
    ) : null}
    </>
  );
};

export default Content;
