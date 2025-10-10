import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchSingleProduct from "./useFetchSingleProduct.js";


const displaySingleProductHook = () => {
    const {id} = useParams();
    const [product, setProduct] = useState([]);
    
    useFetchSingleProduct(id, setProduct);


    return {
        product
    };
};

export default displaySingleProductHook;