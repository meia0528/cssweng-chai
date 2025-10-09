import { useState, useRef, useEffect } from "react";
import useClickOutside from "./useClickOutside.js";

const useSidebar = () => {
    
    const [management, setManagement] = useState('Product Management');
    const [subPage, setSubPage] = useState('Display');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useClickOutside(dropdownRef, setIsOpen);

    const displayDropDownList = () => {
        setIsOpen(!isOpen);
    }

    const handleDropdownSelect = (selectedOption) => {
        setManagement(selectedOption);
        setIsOpen(!isOpen);
    }


    const renderSubPage = (pageSelected) => {
        setSubPage(pageSelected)
    }


    return {
        management,
        subPage,
        isOpen,
        dropdownRef,
        renderSubPage,
        displayDropDownList,
        handleDropdownSelect,
    };
}

export default useSidebar;