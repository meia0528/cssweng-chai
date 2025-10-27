import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useFetchSingleProduct from "./useFetchSingleProduct.js";
import useFetchProductType from "./useFetchProductType.js";
import useClickOutside from "../useClickOutside.js";

const updateProductHook = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    const {id} = useParams();
    const dropdownRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [lSizePhoto, setLSizePhoto] = useState();
    const [product, setProduct] = useState();
    const [productTypes, setProductTypes] = useState([]);
    const [isLSizeDeleted, setIsLSizeDeleted] = useState(false);

    const [selectedTitle, setSelectedTitle] = useState(product?.title);
    const [prevImages, setPrevImages] = useState([]);
    const [selectedDescription, setSelectedDescription] = useState(product?.description);
    const [selectedPrice, setSelectedtPrice] = useState(product?.price);
    const [selectedQty, setSelectedQty] = useState(product?.quantity);
    const [selectedType, setSelectedType] = useState(product?.type?.name);

    const [prevDeleteImages, setPrevDeleteImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
    const [newImageFiles, setNewImageFiles] = useState([null, null, null, null]);

    useEffect(() => {
        if (product?.title) setSelectedTitle(product.title);
        if (product?.description) setSelectedDescription(product.description)
        if (product?.price) setSelectedtPrice(product.price)
        if (product?.quantity) setSelectedQty(product.quantity)
        if (product?.type?.name) setSelectedType(product.type.name)
        if (Array.isArray(product?.images)) setPrevImages(product.images);
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

        if (index === 0)
            setLSizePhoto(imagePreviews[index]);
    };


    const handleRemovedImage = (index) => {
        // delete preview
        const newPreviews = [...imagePreviews];
        newPreviews[index] = null;
        setImagePreviews(newPreviews);

        // delete 'previous' new selected file
        const newFiles = [...newImageFiles];
        newFiles[index] = null
        setNewImageFiles(newFiles);        

        // save the deleted previous selected image; content is path not file
        const newImagesToDelete = [...prevDeleteImages, prevImages[index]];
        setPrevDeleteImages(newImagesToDelete);

        // delete the corresponding previous images; this will serve as the remaining previous images
        const newPrevImage = [...prevImages];
        newPrevImage[index] = null;
        setPrevImages(newPrevImage)

        // remove the LSizePhoto if the image[0] was removed
        if (index === 0){
            setLSizePhoto(null);
            setIsLSizeDeleted(true);
        }
    }


    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", selectedTitle);
        formData.append("description", selectedDescription);
        formData.append("price", selectedPrice);
        formData.append("quantity", selectedQty);
        formData.append("type", selectedType);
        

        if (prevImages.length > 0) {
            prevImages.forEach((imgPath, index) => {
                if (imgPath) formData.append(`prevImagesToKeep${index}`, imgPath);
            });
        }


        if(prevDeleteImages.length > 0){
            prevDeleteImages.forEach((imgPath) => {
                if (imgPath) formData.append(`prevImagesToDelete`, imgPath);
            })
        }


        // new uploaded images
        if (newImageFiles && newImageFiles.length > 0) {
            newImageFiles.forEach((file, index) => {
                if (file) formData.append(`images${index}`, file);
            });
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/product-mgmt/update/${product._id}`, formData, { 
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }}
            );

            setAlert({ message: response.data.message, type: 'success' });
            setTimeout(() => {
                setAlert({ message: '', type: '' });                // hide the alert
                navigate('/admin/product-mgmt/display');
            }, 2000);

        } catch (error) {
            console.error("Error updating product:", error);
            
            const errorMsg = err.response?.data?.message || 'Something went wrong!';
            setAlert({message: errorMsg, type: 'error'});
            setTimeout(() => {
                setAlert({ message: '', type: '' });                // hide the alert
            }, 2000);
        }
    };



    return {
        product,
        lSizePhoto,
        isOpen,
        setIsOpen,
        handleDropdownSelect,
        setLSizePhoto, 
        setSelectedTitle, 
        setPrevImages, 
        setSelectedtPrice, 
        setSelectedQty, 
        setSelectedType,
        selectedTitle,
        selectedDescription,
        setSelectedDescription, 
        selectedPrice,
        selectedQty,
        selectedType,
        prevImages,
        handleImageChange,
        imagePreviews,
        alert,
        handleRemovedImage,
        handleUpdate,
        isLSizeDeleted,
        productTypes
    };
};

export default updateProductHook;