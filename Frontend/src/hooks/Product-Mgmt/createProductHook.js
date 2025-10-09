import { useEffect, useState, useRef } from "react";
import useClickOutside from "../useClickOutside.js";
import axios from "axios";

const createProductHook = () => {

    const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
    const [productTypes, setProductTypes] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);


    const [selectedTitle, setSelectedTitle] = useState('');
    const [imageFiles, setImageFiles] = useState([null, null, null, null]);
    const [selectedDescription, setSelectedDescription] = useState('');
    const [selectedPrice, seSelectedtPrice] = useState();
    const [selectedQty, setSelectedQty] = useState();
    const [selectedType, setSelectedType] = useState('Select an option');    


    // useEffect
    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const res = await axios.get("http://localhost:5000/product-mgmt/product-types")
                setProductTypes(res.data);
            } catch (err) {
                console.error("Error fetching product types:", err);
            }
        };

        fetchProductTypes();
    }, []);

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
        const formData = new FormData();
        imageFiles.forEach((file) => {
            if(file) formData.append('images', file);
        });

        formData.append('title', selectedTitle);
        formData.append('description', selectedDescription);
        formData.append('price', selectedPrice);
        formData.append('quantity', selectedQty);
        formData.append('type', selectedType);


        try {
            const res = await axios.post('http://localhost:5000/product-mgmt/create', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log(res.data);

        } catch (error) {
            
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
        setSelectedQty
    };
}

export default createProductHook;