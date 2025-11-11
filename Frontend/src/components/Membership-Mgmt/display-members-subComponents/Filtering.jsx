import '../../../assets/css/Product-Mgmt/displayProducts/product-filtering.css';

// Reuses product filtering styles for consistency
const Filtering = ({ sortOption, displayDropDownList, handleDropDownSelect, isOpen, dropdownRef, statusFilters, handleSelectedStatusFilter }) => {
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
