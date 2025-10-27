import { useState } from "react";
import { useNavigate } from "react-router-dom";

const registerHook = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState({message: '', type: ''});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleRegister = () => {
        
    }

    return {
        alert,
        username,
        setUsername,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        handleRegister,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword
    };
};

export default registerHook;