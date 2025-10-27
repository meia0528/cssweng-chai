import { useState } from "react";
import { useNavigate } from "react-router-dom";

const loginHook = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState({message: '', type: ''});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = () => {
        
    }

    return {
        alert,
        username,
        setUsername,
        password,
        setPassword,
        handleLogin
    };
};

export default loginHook;