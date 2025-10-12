const express = require('express')
const router = express.Router()
const upload = require('../config/multer.js');
const {getProductTypes, createProduct, displayProducts, renderSingleProduct, deleteSingleProduct, updateProduct} = require('../controllers/product-controller.js')


router.route('/product-types').get(getProductTypes);

// apply multer to this route
router.route('/create').post(upload.array('images', 4), createProduct);

router.route('/fetch-products').get(displayProducts);

router.route('/display/:id').get(renderSingleProduct).delete(deleteSingleProduct);

// apply multer to this route ; in this route image order matters
router.route('/update/:id').put(upload.fields([
    { name: 'images0', maxCount: 1 },
    { name: 'images1', maxCount: 1 },
    { name: 'images2', maxCount: 1 },
    { name: 'images3', maxCount: 1 },
  ]), 
  updateProduct
);


module.exports = router;