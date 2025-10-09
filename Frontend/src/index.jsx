import React from "react";
import ReactDOM from "react-dom/client";
import './assets/css/general.css'
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)