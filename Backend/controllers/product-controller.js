const Product = require('../models/product-model.js');
const ProductType = require('../models/productType-model.js')
const path = require('path')
const fs = require('fs')

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
        const imagePaths = req.files.map((file) => file.path.replace(/\\/g, '/')) || [];

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
    try {        
        let { page = 1, limit = 6, search = '', sort, types } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);


        // search filter
        const query = {};
        if (search) query.title = { $regex: search, $options: 'i' };    // case-insensitive

        // product type filter
        if (types) {
            const typeNames = types.split(',');
            const typeDocs = await ProductType.find({ name: { $in: typeNames } });
            const typeIds = typeDocs.map(t => t._id);
            query.type = { $in: typeIds };
        }

        // sorting
        let sortQuery = {};
        switch (sort) {
            case 'Alphabetical':
                sortQuery = { title: 1 };
                break;
            case 'Price: Low to High':
                sortQuery = { price: 1 };
                break;
            case 'Price: High to Low':
                sortQuery = { price: -1 };
                break;
            default:
                sortQuery = { title: 1 };
        }


        const totalProducts = await Product.countDocuments(query);

        const products = await Product.find(query)
            .populate('type', 'name')
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({ products, totalPages: Math.ceil(totalProducts / limit), currentPage: page});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const renderSingleProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id).populate('type', 'name');

        if (!product) 
            return res.status(404).json({ message: 'Product not found' });

        res.json({
            ...product.toObject(),
            images: product.images.map(img => img.replace(/\\/g, '/'))
        });


    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


const deleteSingleProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) 
            return res.status(404).json({ message: "Product not found." });
        
        await Product.findByIdAndDelete(id);

        // delete the images saved in uploads folder
        if (product.images && product.images.length > 0) {
            for (const imagePath of product.images) {
                const fullPath = path.join(process.cwd(), imagePath);

                fs.unlink(fullPath, (err) => {
                    if (err) console.error("Failed to delete image:", imagePath, err.message);
                    else console.log("Deleted image:", imagePath);
                });
            }
        }

        
        res.status(200).json({ message: "Product deleted successfully!" });

    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ message: "Failed to delete product." });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, quantity, type } = req.body;
        const newImagePaths = req.files.map((file) => file.path.replace(/\\/g, '/')) || [];


        // check if previous images are in an array, otherwise make it to array
        const prevImagesToKeep = Array.isArray(req.body.prevImagesToKeep) ? (req.body.prevImagesToKeep) : (req.body.prevImagesToKeep ? [req.body.prevImagesToKeep] : []);


        // request from database
        const prevProduct = await Product.findById(id);
        if (!prevProduct) return res.status(404).json({ message: "Product not found." });

        const productType = await ProductType.findOne({ name: type });
        if (!productType) return res.status(400).json({ message: `Invalid product type: ${type}` });


        // determine which previous images are no longer kept
        const imagesToDelete = Array.from(prevProduct.images).filter((path) => (
            !prevImagesToKeep.includes(path)
        ))        

        
        // delete old images not kept
        for (const imagePath of imagesToDelete) {
            // remove leading 'uploads/' prevent duplicate in the code after this
            const filename = imagePath.replace('uploads/', '');

            // build absolute path from project root
            const fullPath = path.join(process.cwd(), 'uploads', filename);

            try {
                await fs.promises.unlink(fullPath);
                console.log(`Deleted old image: ${imagePath}`);
            } catch (err) {
                console.error(`Failed to delete image ${err.message}:`);
            }
        }

        
        const updatedImages = [...prevImagesToKeep, ...newImagePaths];

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                title,
                description,
                price,
                quantity,
                type: productType._id,
                images: updatedImages,
            }, {
                new: true, runValidators: true 
            }
        );

        if(updatedProduct)
            res.status(200).json({ message: "Product updated successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating product." });
    }
};


module.exports = {
    getProductTypes,
    createProduct,
    displayProducts,
    renderSingleProduct,
    deleteSingleProduct,
    updateProduct
}