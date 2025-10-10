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


module.exports = {
    getProductTypes,
    createProduct,
    displayProducts,
    renderSingleProduct
}