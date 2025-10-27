const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        require
    },
    password: {
        type: String,
        require
    }
});

module.exports = mongoose.model('Admin', adminSchema);