import { useEffect } from "react";
import axios from "axios";

const useFetchSingleProduct = (id, setProduct, setLSizePhoto) => {
    
    useEffect(() => {
        if(!id) return;

        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/product-mgmt/display/${id}`);
                setProduct(res.data);

                if(res.data.images && res.data.images.length > 0)
                    setLSizePhoto(res.data.images[0])

            } catch (err) {
                console.error("Error fetching a product:", err);
            }
        }

        fetchProduct()
    }, [id])

};

export default useFetchSingleProduct;