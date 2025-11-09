const mongoose = require('mongoose');

const donateSchema = new mongoose.Schema({
    name: String,
    contactNo: String
});

module.exports = mongoose.model('donate', donateSchema);