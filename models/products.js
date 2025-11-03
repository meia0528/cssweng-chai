const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    quantity: Number,
    type: String,
	images: String
});

module.exports = mongoose.model('products', productSchema);