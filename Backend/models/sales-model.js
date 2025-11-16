const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema(
    {
        orderId: { type: String, trim: true, required: true, unique: true, index: true },
        customerName: { type: String, trim: true, required: true },
        // keep productId as a reference to Product for convenience, and also store productName for fast display
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, trim: true, required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        total: { type: Number, required: true, min: 0 },
        status: { type: String, trim: true, default: 'Pending' },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Sale', salesSchema);
