import { useEffect, useState } from "react";
import { isExpired, decodeToken } from "react-jwt";
import { useNavigate, useLocation } from "react-router-dom";
import AlertBox from "../components/AlertBox.jsx";

const useAuthCheck = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem("adminToken");
            if (isExpired(token))
                setShowAlert(true);
        }, 5000);

        
        return () => clearInterval(interval);
    }, []);


    return (
        <>
            {showAlert && (
                <AlertBox
                    message="Session expired. Please log in again." 
                    onClose={() => {
                        setShowAlert(false);
                        localStorage.removeItem("adminToken");
                        navigate("/admin/login", { replace: true });
                    }}>
                </AlertBox>
            )}        
        </>
    )


};

export default useAuthCheck;
