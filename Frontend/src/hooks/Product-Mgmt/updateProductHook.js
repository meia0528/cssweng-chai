import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useFetchSingleProduct from "./useFetchSingleProduct.js";
import useFetchProductType from "./useFetchProductType.js";
import useClickOutside from "../useClickOutside.js";

const updateProductHook = () => {
    const navigate = useNavigate();

    const {id} = useParams();
    const dropdownRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [lSizePhoto, setLSizePhoto] = useState();
    const [product, setProduct] = useState();
    const [productTypes, setProductTypes] = useState([]);

    const [selectedTitle, setSelectedTitle] = useState(product?.title);
    const [prevImageFiles, setPrevImageFiles] = useState([]);
    const [selectedDescription, setSelectedDescription] = useState(product?.description);
    const [selectedPrice, setSelectedtPrice] = useState(product?.price);
    const [selectedQty, setSelectedQty] = useState(product?.quantity);
    const [selectedType, setSelectedType] = useState(product?.type?.name);

    const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
    const [newImageFiles, setNewImageFiles] = useState([null, null, null, null]);

    useEffect(() => {
        if (product?.title) setSelectedTitle(product.title);
        if (product?.description) setSelectedDescription(product.description)
        if (product?.price) setSelectedtPrice(product.price)
        if (product?.quantity) setSelectedQty(product.quantity)
        if (product?.type?.name) setSelectedType(product.type.name)
        if (Array.isArray(product?.images)) setPrevImageFiles(product.images);
    }, [product]);


    useClickOutside(dropdownRef, setIsOpen);
    useFetchSingleProduct(id, setProduct, setLSizePhoto);
    useFetchProductType(setProductTypes);


    const handleDropdownSelect = (selectedOption) => {
        setSelectedType(selectedOption);
        setIsOpen(!isOpen);
    }


    const handleImageChange = (e, index)  =>{
        const file = e.target.files[0];                 // get the first selected file
        if(!file) return;

        // store file for upload
        const newFiles = [...newImageFiles];
        newFiles[index] = file
        setNewImageFiles(newFiles);


        // show image for preview
        const reader = new FileReader();            // read the raw data of files stored on the user's computer
        reader.onload = (e) => {
            const newPreviews = [...imagePreviews];
            newPreviews[index] = e.target.result;
            setImagePreviews(newPreviews);
        };

        reader.readAsDataURL(file);                 // raw image data loaded into memory, encoded as a string
    };    


    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", selectedTitle);
        formData.append("description", selectedDescription);
        formData.append("price", selectedPrice);
        formData.append("quantity", selectedQty);
        formData.append("type", selectedType);


        const imagesNotDeleted = prevImageFiles.filter((path, index) => (
            newImageFiles[index] === null
        ));

        if (imagesNotDeleted.length > 0) {
            imagesNotDeleted.forEach((imgPath) => {
                if (imgPath) formData.append("prevImagesToKeep", imgPath);
            });
        }


        // new uploaded images
        if (newImageFiles && newImageFiles.length > 0) {
            newImageFiles.forEach((file) => {
                if (file) formData.append("images", file);
            });
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/product-mgmt/update/${product._id}`,
                formData, { headers: {"Content-Type": "multipart/form-data"} }
            );

            setAlert({ message: response.data.message, type: 'success' });
            setTimeout(() => {
                setAlert({ message: '', type: '' });                // hide the alert
                navigate('/admin/product-mgmt/display');
            }, 2000);

        } catch (error) {
            console.error("Error updating product:", error);
            setAlert({ message: response.data.message, type: 'error' });
            setTimeout(() => {
                setAlert({ message: '', type: '' });                // hide the alert
            }, 2000);
        }
    };



    return {
        product,
        lSizePhoto,
        handleUpdate,
        productTypes,
        dropdownRef,
        isOpen,
        setIsOpen,
        handleDropdownSelect,
        setLSizePhoto, 
        setSelectedTitle, 
        setPrevImageFiles, 
        setSelectedDescription, 
        setSelectedtPrice, 
        setSelectedQty, 
        setSelectedType,
        selectedTitle,
        selectedDescription,
        selectedPrice,
        selectedQty,
        selectedType,
        prevImageFiles,
        handleImageChange,
        imagePreviews,
        alert
    };
};

export default updateProductHook;