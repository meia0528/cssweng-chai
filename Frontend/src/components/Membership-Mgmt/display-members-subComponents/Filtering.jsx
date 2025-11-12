import '../../../assets/css/Product-Mgmt/displayProducts/product-filtering.css';

const Filtering = ({ sortOption, displayDropDownList, handleDropDownSelect, isOpen, dropdownRef, statusFilters, handleSelectedStatusFilter, search }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const mapSortOption = (sort) => {
    switch (sort) {
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

  const handleDownloadCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      params.set('sort', mapSortOption(sortOption));
      const activeStatuses = (statusFilters || []).filter((s) => s.checked).map((s) => s.name);
      if (activeStatuses.length === 1) params.set('status', activeStatuses[0]);

      const url = `http://localhost:5000/members/export?${params.toString()}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Failed to export CSV (${res.status})`);
      const blob = await res.blob();
      const cd = res.headers.get('Content-Disposition') || '';
      const match = cd.match(/filename="?([^";]+)"?/i);
      const filename = match ? match[1] : `Members_${new Date().toISOString().slice(0,16).replace(/[:T]/g, '-')}.csv`;
      const link = document.createElement('a');
      const href = URL.createObjectURL(blob);
      link.href = href;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error('CSV export failed', err);
    }
  };
  const sortOptionList = [
    'Newest First',
    'Oldest First',
    'Alphabetical',
    'Events: High to Low',
    'Events: Low to High',
  ];

  const statusOptions = ['Active', 'Pending', 'Inactive', 'Expired'];

  return (
    <nav>
      <div className="filter-section">
        <div style={{ width: 205, marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <button type="button" className="member-submit-btn" onClick={handleDownloadCSV}>
            Download CSV
          </button>
        </div>
        <div className="sort-section">
          <p>Sort By</p>
          <div className="dropdown-section" ref={dropdownRef}>
            <button className="dropdown-button" onClick={displayDropDownList}>
              {sortOption}
            </button>

            {isOpen && (
              <div className="dropdown-list">
                {sortOptionList.map((option, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleDropDownSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="product-section">
          <p>Status</p>
          {statusOptions.map((status, idx) => (
            <label className="checkbox-section" key={idx}>
              <input
                type="checkbox"
                onChange={(e) => handleSelectedStatusFilter(e, status)}
                checked={statusFilters.some((s) => s.name === status)}
              />
              <span className="checkmark"></span>
              {status}
            </label>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Filtering;
