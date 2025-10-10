import { useEffect } from "react";
import axios from "axios";

const useFetchProductType = (setProductTypes) => {

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
};

export default useFetchProductType;