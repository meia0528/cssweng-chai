import { useEffect } from "react";
import axios from "axios";

const useFetchProducts = (setProducts) => {

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/product-mgmt/fetch-products');
                setProducts(res.data);

            } catch (err) {
                console.error("Error fetching products:", err);
            }
        }

        fetchProducts();
    }, []);
}

export default useFetchProducts;