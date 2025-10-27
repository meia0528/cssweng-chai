import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const loginHook = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState({message: '', type: ''});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/auth/login", {username, password});
            localStorage.setItem("adminToken", res.data.token)  // store JWT in localStorage

            setAlert({message: res.data.message, type: 'success'});
            setTimeout(() => {
                setAlert({ message: '', type: '' });                // hide the alert
                navigate('/admin/product-mgmt/display');
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
        handleLogin
    };
};

export default loginHook;