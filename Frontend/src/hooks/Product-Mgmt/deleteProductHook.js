import { useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import axios from "axios";

const deleteProductHook = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");
    
    const {id} = useParams();
    const [alert, setAlert] = useState({ message: '', type: ''})
    const [showConfirm, setShowConfirm] = useState(false);
    
    const deleteProduct = async () => {
        try {
            const res = await axios.delete(`http://localhost:5000/product-mgmt/display/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setAlert({message: res.data.message, type: 'success'});
            setTimeout(() => {
                setAlert({ message: '', type: '' });                        // hide the alert
                navigate('/admin/product-mgmt/display')                     // navigate to display page
            }, 2000);
            
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Something went wrong!';
            
            setAlert({message: errorMsg, type: 'error'});
            setTimeout(() => {
                setAlert({ message: '', type: '' });                        // hide the alert
            }, 2000);            
        }
    };

    return {
        alert,
        deleteProduct,
        showConfirm,
        setShowConfirm
    }
}

export default deleteProductHook;