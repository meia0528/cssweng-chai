import { useState, useRef } from 'react';

const displaySalesHook = () => {
  const [sortOption, setSortOption] = useState('Newest First');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [statusFilters, setStatusFilters] = useState([]);
  const [search, setSearch] = useState('');

  const displayDropDownList = () => setIsOpen((s) => !s);

  const handleDropDownSelect = (option) => {
    setSortOption(option);
    setIsOpen(false);
  };

  const handleSelectedStatusFilter = (e, name) => {
    if (e.target.checked) {
      setStatusFilters((s) => [...s, { name }]);
    } else {
      setStatusFilters((s) => s.filter((sf) => sf.name !== name));
    }
  };

  return {
    sortOption,
    displayDropDownList,
    handleDropDownSelect,
    isOpen,
    dropdownRef,
    statusFilters,
    handleSelectedStatusFilter,
    search,
    setSearch,
  };
};

export default displaySalesHook;
