const Product = require('../models/product-model.js');
const ProductType = require('../models/productType-model.js')

const getProductTypes = async (req, res) => {
    try {
        const types = await ProductType.find();     // return an array of javascript object
        res.json(types);                            // return json style
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server error'});
    }
};

const createProduct = async (req, res) => {
    try {
        const { title, description, price, quantity, type } = req.body;
        const imagePaths = req.files.map((file) => file.path);

        const productType = await ProductType.findOne({ name: type });
        if (!productType)
            return res.status(400).json({ message: `Invalid product type: ${type}` });
        

        const newProduct = new Product({
            title,
            description,
            price: Number(price),
            quantity: Number(quantity),
            type: productType._id,
            images: imagePaths
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully!' });

    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: 'Failed to create product.' });
    }
};


const displayProducts = async (req, res) => {

};


module.exports = {
    getProductTypes,
    createProduct,
    displayProducts
}