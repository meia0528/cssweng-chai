import { useState, useRef } from "react";
import useFetchProductType from '../Product-Mgmt/useFetchProductType.js';
import useClickOutside from '../../hooks/useClickOutside.js';
import axios from "axios";

const displayProductsHook = () => {
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });

    const [productTypes, setProductType] = useState([]);
    const [sortOption, setSortOption] = useState('Alphabetical');
    const [productFilter, setProductFilter] = useState([]);
    const [search, setSearch] = useState();


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

    
    const clearAllProducts = async () => {
        try {
            const res = await axios.delete(`http://localhost:5000/product-mgmt/clearAll`);

            setAlert({message: res.data.message, type: 'success'});
            setTimeout(() => {
                setAlert({ message: '', type: '' });                // hide the alert
                window.location.reload(); 
            }, 2000);            

        } catch (err) {
            console.err(`Error: ${err}`);
            
            setAlert({message: res.data.message, type: 'error'});  
            setTimeout(() => {
                setAlert({ message: '', type: '' });                // hide the alert
            }, 2000);             
        }
    };

    return {
        sortOption, 
        displayDropDownList,
        handleDropDownSelect,
        isOpen,
        dropdownRef,
        productTypes,
        handleSelectedProductFilter,
        productFilter,
        setSearch,
        search,
        setShowModal,
        showModal,
        clearAllProducts,
        alert
    };
};

export default displayProductsHook;