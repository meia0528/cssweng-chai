import { useState, useRef } from "react";
import axios from "axios";
import useFetchProductType from '../../hooks/useFetchProductType.js';
import useClickOutside from '../../hooks/useClickOutside.js';

const displayProductsHook = () => {
    const [sortOption, setSortOption] = useState('Alphabetical');
    const [productTypes, setProductType] = useState([]);
    const [productFilter, setProductFilter] = useState([]);
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);


    useFetchProductType(setProductType);
    useClickOutside(dropdownRef, setIsOpen);

    const displayDropDownList = () => {
        setIsOpen(!isOpen);
    };

    const handleDropDownSelect = (selectedSort) => {
        setSortOption(selectedSort);
        setIsOpen(!isOpen);
    };


    const handleSelectedProductFilter = (e, selectedProduct) => {
        if (e.target.checked) 
            setProductFilter((prevFilters) => [ ...prevFilters, { name: selectedProduct, checked: true }]);
        else 
            setProductFilter((prevFilters) => prevFilters.filter((product) => product.name !== selectedProduct));
    };


    
    return {
        sortOption, 
        displayDropDownList,
        handleDropDownSelect,
        isOpen,
        dropdownRef,
        productTypes,
        handleSelectedProductFilter
    };
}

export default displayProductsHook;