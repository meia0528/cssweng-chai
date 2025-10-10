import { useState, useRef } from "react";
import useClickOutside from "../useClickOutside.js";
import useFetchProductType from "../useFetchProductType.js";
import axios from "axios";

const createProductHook = () => {

    const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
    const [productTypes, setProductTypes] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const dropdownRef = useRef(null);


    const [selectedTitle, setSelectedTitle] = useState('');
    const [imageFiles, setImageFiles] = useState([null, null, null, null]);
    const [selectedDescription, setSelectedDescription] = useState('');
    const [selectedPrice, seSelectedtPrice] = useState();
    const [selectedQty, setSelectedQty] = useState();
    const [selectedType, setSelectedType] = useState('Select an option');    


    useFetchProductType(setProductTypes);
    useClickOutside(dropdownRef, setIsOpen);

    // functions
    const displayDropDownList = () => {
        setIsOpen(!isOpen);
    }

    const handleDropdownSelect = (selectedOption) => {
        setSelectedType(selectedOption);
        setIsOpen(!isOpen);
    }

    const handleImageChange = (e, index)  =>{
        const file = e.target.files[0];                 // get the first selected file
        if(!file) return;

        // store file for upload
        const newFiles = [...imageFiles];
        newFiles[index] = file
        setImageFiles(newFiles);


        // show image for preview
        const reader = new FileReader();            // read the raw data of files stored on the user's computer
        reader.onload = (e) => {
            const newPreviews = [...imagePreviews];
            newPreviews[index] = e.target.result;
            setImagePreviews(newPreviews);
        };

        reader.readAsDataURL(file);                 // raw image data loaded into memory, encoded as a string
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // return true if imageFiles do have content
        const hasImage = imageFiles.some((file) => file !== null);
        if(!hasImage){
            setAlert({message: 'Please upload at least one image.', type: 'error'});
            setTimeout(() => setAlert({message: '', type: ''}), 2000);
            return;     // stop submission
        }

        const formData = new FormData();
        imageFiles.forEach((file) => {
            if(file) formData.append('images', file);
        });

        // same name when using req.body in backend
        formData.append('title', selectedTitle);
        formData.append('description', selectedDescription);
        formData.append('price', selectedPrice);
        formData.append('quantity', selectedQty);
        formData.append('type', selectedType);


        try {
            // pass the formData to backend
            const res = await axios.post('http://localhost:5000/product-mgmt/create', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            
            setAlert({message: res.data.message, type: 'success'});
            setTimeout(() => {
                setAlert({ message: '', type: '' });    // hide the alert
                window.location.reload();               // reload the page after hiding
            }, 2000);
            
        } catch (err) {

            const errorMsg = err.response?.data?.message || 'Something went wrong!';
            setAlert({message: errorMsg, type: 'error'});
            setTimeout(() => {
                setAlert({ message: '', type: '' });    // hide the alert
            }, 2000);

        }
    }




    return {
        imagePreviews,
        handleImageChange,
        handleSubmit,
        productTypes,
        displayDropDownList,
        isOpen,
        dropdownRef,
        handleDropdownSelect,
        selectedType,
        setSelectedTitle,
        selectedTitle,
        selectedDescription, 
        setSelectedDescription,
        selectedPrice, 
        seSelectedtPrice,
        selectedQty, 
        setSelectedQty,
        alert
    };
}

export default createProductHook;