import { useEffect } from "react";
import { isExpired } from "react-jwt";
import { useNavigate, useLocation } from "react-router-dom";

const useAuthCheck = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("adminToken");
            if (!token) return;

            if (isExpired(token)) {
                
                localStorage.removeItem("adminToken");
                alert("Session expired. Please log in again.");
                navigate("/admin/login", { replace: true });
            }
        };

        
        checkToken();
        const interval = setInterval(checkToken, 5000);

        // cleanup on unmount
        return () => clearInterval(interval);
    }, [location.pathname]);
};

export default useAuthCheck;
