import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const registerHook = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState({message: '', type: ''});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showToken, setShowToken] = useState(false);


    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/auth/register", {username, password, token});

            setAlert({message: response.data.message, type: 'success'});
            setTimeout(() => {
                setAlert({ message: '', type: '' });                // hide the alert
                navigate('/admin/login');
            }, 2000);

        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Something went wrong!';
            setAlert({message: errorMsg, type: 'error'});
            setTimeout(() => {
                setAlert({ message: '', type: '' });                // hide the alert
            }, 2000);  
        }
    }



    return {
        alert,
        username,
        setUsername,
        password,
        setPassword,
        token,
        setToken,
        handleRegister,
        showPassword,
        setShowPassword,
        showToken,
        setShowToken
    };
};

export default registerHook;