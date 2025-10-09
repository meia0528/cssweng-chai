import { useEffect } from "react";

const useClickOutside = (dropdownRef, setIsOpen) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownRef, setIsOpen]);
};

export default useClickOutside;
