import { useEffect } from "react";
import axios from "axios";

const useFetchSingleProduct = (id, setProduct) => {
    
    useEffect(() => {
        if(!id) return;

        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/product-mgmt/display/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Error fetching a product:", err);
            }
        }

        fetchProduct()
    }, [id])

};

export default useFetchSingleProduct;