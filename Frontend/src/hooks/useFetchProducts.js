import { useEffect, useState } from "react";
import axios from "axios";

const useFetchProducts = (currentPage, search, sortOption, productFilter) => {
    const [data, setData] = useState({ products: [], totalPages: 1, currentPage: 1 });

    useEffect(() => {
        const fetchProducts = async () => {
            try {

                const selectedTypes = productFilter
                    .filter(f => f.checked)
                    .map(f => f.name);

                const res = await axios.get('http://localhost:5000/product-mgmt/fetch-products', {
                    params: { page: currentPage, limit: 6, search: search || '', sort: sortOption, types: selectedTypes.join(',') }});
                    
                setData(res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        }

        fetchProducts();
    }, [currentPage, search, sortOption, productFilter]);

    return data;
}

export default useFetchProducts;
