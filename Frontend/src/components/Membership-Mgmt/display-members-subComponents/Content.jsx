import { useState, useMemo } from 'react';
import axios from 'axios';
import useFetchMembers from '../../../hooks/Membership-Mgmt/useFetchMembers.js';

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
      await axios.put(
        `http://localhost:5000/members/${member._id}`,
        { eventsAttended: next },
        { headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' } }
      );
      reload();
    } catch (err) {
      console.error('Failed to increment events', err);
    }
  };

  return (
    <main className="displayAllProducts">
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
                <th style={{ width: '24%' }}>Email</th>
                <th style={{ width: '16%' }}>Phone</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '12%' }}>Events</th>
                <th style={{ width: '20%' }}>Member Since</th>
              </tr>
            </thead>
            <tbody>
              {formattedMembers.map((m) => (
                <tr key={m._id}>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.displayName || '(No name)'}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.phoneNumber || ''}</td>
                  <td>
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
                </tr>
              ))}
              {formattedMembers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>
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
  );
};

export default Content;
