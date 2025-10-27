const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv  = require('dotenv');
const path = require('path');
const Admin = require('../models/admin-model');

dotenv.config({ path: '../.env'});

const registerAdmin = async (req, res) => {
    try {
        const {username, password, token} = req.body;

        const existing = await Admin.findOne({username});
        if(existing) return res.status(400).json({message: 'Admin already exists.'});

        if (token !== process.env.TOKEN) return res.status(400).json({message: 'Incorrect admin token.'});

        const hashed = await bcrypt.hash(password, 10);
        const admin  = new Admin({username, password: hashed });
        await admin.save();

        res.status(201).json({ message: "Admin registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error registering admin" });
    }
};


const loginAdmin = async (req, res) => {
    try {
        const {username, password } = req.body;

        const admin = await Admin.findOne({username});
        if(!admin) return res.status(400).json({ message: "Invalid credentials." });

        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return res.status(400).json({ message: "Invalid credentials" });


        // generate JWT token
        const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(200).json({ token, message: "Login successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error logging in" });
    }
};



module.exports = {
    registerAdmin,
    loginAdmin
}