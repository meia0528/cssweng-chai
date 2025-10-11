import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useSubPageLocation = (setSubPage) => {
    const location = useLocation();

    // auto-detect subpage from the url path
    useEffect(() => {
        if (location.pathname.includes('/display'))
            setSubPage('Display');
        
        else if (location.pathname.includes('/create'))
            setSubPage('Add');
        
    }, [location.pathname]);
};

export default useSubPageLocation;