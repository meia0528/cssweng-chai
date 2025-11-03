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
        res.status(500).json({ message: 'Failed to create product. Please check your input.' });
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


        const newImagePaths = Object.keys(req.files || {})
            .filter((key) => key.startsWith("images"))
            .map((key) => {
                const index = parseInt(key.replace("images", ""), 10);              // removes "images" from the string and converts the remaining part {index} to a number
                const file = req.files[key][0];                                     // gets the first file from that field
                if (!file) return null;                                             // return null if no file
                return { index, path: file.path.replace(/\\/g, "/") };
            })
                .filter(Boolean)                                                    // remove any nulls
                .sort((a, b) => a.index - b.index);                                 // sort based on index number


        const prevImagesToKeep = Object.keys(req.body)
            .filter((key) => key.startsWith("prevImagesToKeep"))                    // gets all the field names from the request body and keep only the keys that start with "prevImagesToKeep"
            .map((key) => {
                const index = parseInt(key.replace("prevImagesToKeep", ""), 10);    // removes "prevImagesToKeep" from the string and converts the remaining part {index} to a number
                return { index: index, path: req.body[key] };

            }).sort((a, b) => a.index - b.index);                                   // sort based on index number



        // check if it is an array, otherwise convert it to array
        const prevImagesToDelete = Array.isArray(req.body.prevImagesToDelete) ? (req.body.prevImagesToDelete) : (req.body.prevImagesToDelete ? [req.body.prevImagesToDelete] : []);            


        // request from database
        const prevProduct = await Product.findById(id);
        if (!prevProduct) return res.status(404).json({ message: "Product not found." });

        const productType = await ProductType.findOne({ name: type });
        if (!productType) return res.status(400).json({ message: `Invalid product type: ${type}` });


        
        // delete old images not kept
        for (const imagePath of prevImagesToDelete) {
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

        
        // updated images
        let updatedImages = [];
        for (let i = 0; i < 4; i++) {
            const newImg = newImagePaths.find(img => img.index === i);
            const prevKeepImg = prevImagesToKeep.find(img => img.index === i);

            if (newImg) updatedImages.push(newImg.path);
            else if (prevKeepImg) updatedImages.push(prevKeepImg.path);
        }

        if (updatedImages.length === 0) return res.status(500).json({message: "You must have at least one image."});
        

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


const clearAllProducts = async (req, res) => {
    try {
        const nProducts = await Product.countDocuments();
        if(nProducts > 0){
            await Product.deleteMany({})             // delete all documents in the Product collection
            res.status(200).json({ message: "All products have been deleted successfully!", nProducts});
        }
        else
            res.status(200).json({ message: "No products found to clear.", nProducts});

        
        // delete all the files stored in uploads folder
        const uploadDir = path.join(process.cwd(), "uploads");

        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                console.error("Error reading upload folder:", err);
                return;
            }

            for (const file of files) {
                fs.unlink(path.join(uploadDir, file), (err) => {
                if (err) console.error("Error deleting file:", file, err);
                });
            }
        });

    } catch (err) {
         console.error(err);
        res.status(500).json({ message: "Failed to clear products." });
    }
};


module.exports = {
    getProductTypes,
    createProduct,
    displayProducts,
    renderSingleProduct,
    deleteSingleProduct,
    updateProduct,
    clearAllProducts
}