import { useState, useRef, useEffect } from "react";
import useClickOutside from "./useClickOutside.js";

const useSidebar = () => {
    let mgmtPath = '';
    const [management, setManagement] = useState('Product Management');
    const [subPage, setSubPage] = useState('Display');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    switch(management){
        case 'Product Management':
            mgmtPath = 'product-mgmt';
            break;
        case 'Post Management':
            mgmtPath = 'post-mgmt';
            break;
        case 'Sales Management':
            mgmtPath = 'sales-mgmt';
            break;
        case 'Membership Management':
            mgmtPath = 'membership-mgmt';
            break;
    }

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
        mgmtPath,
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