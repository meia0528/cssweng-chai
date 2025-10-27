const express = require('express')
const router = express.Router()
const upload = require('../config/multer.js');
const verifyAdmin = require('../middleware/auth-Middleware.js');
const {getProductTypes, createProduct, displayProducts, renderSingleProduct, deleteSingleProduct, updateProduct, clearAllProducts} = require('../controllers/product-controller.js')


router.route('/product-types').get(verifyAdmin, getProductTypes);

// apply multer to this route
router.route('/create').post(verifyAdmin, upload.array('images', 4), createProduct);

router.route('/fetch-products').get(verifyAdmin, displayProducts);

router.route('/display/:id').get(verifyAdmin, renderSingleProduct).delete(verifyAdmin, deleteSingleProduct);

// apply multer to this route ; in this route image order matters
router.route('/update/:id').put(
  verifyAdmin, 
  upload.fields([
    { name: 'images0', maxCount: 1 },
    { name: 'images1', maxCount: 1 },
    { name: 'images2', maxCount: 1 },
    { name: 'images3', maxCount: 1 },
  ]), 
  updateProduct
);

router.route('/clearAll').delete(verifyAdmin, clearAllProducts);

module.exports = router;