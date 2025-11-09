const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    date: String,
    image: String,
    beneficiary: String,
    description: String
});

module.exports = mongoose.model('events', eventSchema);