import { useState } from 'react';
import useFetchSales from '../../../hooks/Sales-Mgmt/useFetchSales.js';

const currency = (n) => `₱ ${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

const Content = ({ search, setSearch, sortOption, statusFilters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { sales, totalPages, reload } = useFetchSales(currentPage, search, sortOption, statusFilters);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <main className="displayAllProducts">
      <div className="product-main-area">
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
                <th style={{ width: '18%' }}>Order ID</th>
                <th style={{ width: '24%' }}>Customer</th>
                <th style={{ width: '16%' }}>Email</th>
                <th style={{ width: '12%' }}>Total</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '18%' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s._id || s.id}>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s._id || s.id}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.customerName || s.customer?.name || ''}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.customerEmail || s.customer?.email || ''}</td>
                  <td>{currency(s.total)}</td>
                  <td>{s.status || '—'}</td>
                  <td>{s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}</td>
                </tr>
              ))}

              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>
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
  );
};

export default Content;
