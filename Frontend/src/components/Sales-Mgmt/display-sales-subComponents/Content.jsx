import { useState } from 'react';
import useFetchSales from '../../../hooks/Sales-Mgmt/useFetchSales.js';

const currency = (n) => `₱ ${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

const badgeStyle = (status) => {
  switch (status) {
    case 'Completed':
      return { background: '#28a745', color: '#fff' };
    case 'Pending':
      return { background: '#ffc107', color: '#212529' };
    case 'Cancelled':
      return { background: '#dc3545', color: '#fff' };
    default:
      return { background: '#6c757d', color: '#fff' };
  }
};

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

const Content = ({ search, setSearch, sortOption, statusFilters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const { sales, totalPages, reload } = useFetchSales(currentPage, search, sortOption, statusFilters);
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const requestDelete = (sale) => {
    setPendingDelete(sale);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await fetch(`http://localhost:5000/sales/${pendingDelete._id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPendingDelete(null);
      setToast('Sale deleted successfully');
      reload();
    } catch (err) {
      console.error('Failed to delete sale', err);
      setToast('Failed to delete sale');
    }
  };

  const cancelDelete = () => setPendingDelete(null);

  useState(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <>
      <main className="displayAllProducts">
        {toast ? (
          <div role="status" aria-live="polite" className="sales-toast">
            {toast}
          </div>
        ) : null}
        <div className="sales-main-area">
          <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
            <div className="search-bar-section">
              <input
                className="search-bar"
                type="text"
                placeholder="Search order id, customer, or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <div style={{ marginTop: 24 }}>
            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead style={{ background: '#f7f7f7' }}>
                <tr>
                  <th style={{ width: '14%' }}>Order ID</th>
                  <th style={{ width: '22%' }}>Customer</th>
                  <th style={{ width: '18%' }}>Product</th>
                  <th style={{ width: '10%' }}>Quantity</th>
                  <th style={{ width: '12%' }}>Status</th>
                  <th style={{ width: '18%' }}>Date</th>
                  <th style={{ width: '6%' }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s._id || s.id}>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.orderId || s._id || s.id}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.customerName || s.customer?.name || ''}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.productName || s.product?.name || ''}</td>
                    <td>{s.quantity ?? 1}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          ...badgeStyle(s.status),
                          padding: '2px 10px',
                          borderRadius: 12,
                          fontSize: 12,
                        }}
                      >
                        {s.status || '—'}
                      </span>
                    </td>
                    <td>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="sales-delete-btn"
                        aria-label={`Delete sale ${s._id || s.id}`}
                        title="Delete sale"
                        onClick={() => requestDelete(s)}
                      >
                        <img src="/img/Product-Mgmt/product-overview/delete.png" alt="Delete" />
                      </button>
                    </td>
                  </tr>
                ))}

                {sales.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center' }}>
                      No sales found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="navigation-area" style={{ marginTop: 16 }}>
            <div />

            <div>
              <button className="nav-button" onClick={() => goToPage(currentPage - 1)}>&lt;</button>
              <button className={`round-button`}>{totalPages > 0 ? currentPage : '0'}</button>
              <button className="nav-button" onClick={() => goToPage(currentPage + 1)}>&gt;</button>
            </div>

            <div>
              <p className="page-summary">
                {totalPages > 0 ? currentPage : '0'} / {totalPages} {totalPages > 1 ? 'pages' : 'page'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {pendingDelete ? (
        <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Confirm delete sale">
          <section style={confirmModalStyle}>
            <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>
            <p style={{ lineHeight: 1.4 }}>
              Are you sure you want to delete sale <strong>{pendingDelete._id || pendingDelete.id}</strong>?<br />
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
