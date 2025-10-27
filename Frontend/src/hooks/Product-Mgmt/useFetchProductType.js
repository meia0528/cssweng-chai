import { useEffect } from "react";
import axios from "axios";

const useFetchProductType = (setProductTypes) => {
    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const res = await axios.get("http://localhost:5000/product-mgmt/product-types", {
                    headers: { Authorization: `Bearer ${token}` }});

                setProductTypes(res.data);
            } catch (err) {
                console.error("Error fetching product types:", err);
            }
        };

        fetchProductTypes();
    }, []);
};

export default useFetchProductType;