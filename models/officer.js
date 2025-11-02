const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema({
    name: String,
    position: String,
    image: String,
    beneficiary: String
});

module.exports = mongoose.model('officers', officerSchema);