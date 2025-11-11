import { useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside.js';

const displayMembersHook = () => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [sortOption, setSortOption] = useState('Newest First');
  const [statusFilters, setStatusFilters] = useState([]); // [{name, checked}]
  const [search, setSearch] = useState('');

  useClickOutside(dropdownRef, setIsOpen);

  const displayDropDownList = () => setIsOpen(!isOpen);

  const handleDropDownSelect = (selected) => {
    setSortOption(selected);
    setIsOpen(false);
  };

  const handleSelectedStatusFilter = (e, status) => {
    if (e.target.checked)
      setStatusFilters((prev) => [...prev, { name: status, checked: true }]);
    else setStatusFilters((prev) => prev.filter((s) => s.name !== status));
  };

  return {
    dropdownRef,
    isOpen,
    displayDropDownList,
    handleDropDownSelect,
    sortOption,
    statusFilters,
    handleSelectedStatusFilter,
    search,
    setSearch,
  };
};

export default displayMembersHook;
