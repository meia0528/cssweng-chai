const mongoose =  require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        require: true,
        integer: true
    },
    quantity: {
        type: Number,
        require: true,
        integer: true        
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
        require: true
    },
    images: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);