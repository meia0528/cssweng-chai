import { useState } from "react";
import { useParams } from "react-router-dom";
import useFetchSingleProduct from "./useFetchSingleProduct.js";


const displaySingleProductHook = () => {
    const {id} = useParams();
    const [product, setProduct] = useState([]);
    const [lSizePhoto, setLSizePhoto] = useState(null);
    
    useFetchSingleProduct(id, setProduct, setLSizePhoto);

    const handleLargeDisplayPhoto = (photoPath) => {
        setLSizePhoto(photoPath)
    };


    return {
        id,
        product,
        lSizePhoto,
        handleLargeDisplayPhoto
    };
};

export default displaySingleProductHook;