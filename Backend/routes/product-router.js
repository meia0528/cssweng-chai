const express = require('express')
const router = express.Router()
const upload = require('../config/multer.js');
const {getProductTypes, createProduct, displayProducts, renderSingleProduct, deleteSingleProduct} = require('../controllers/product-controller.js')


router.route('/product-types').get(getProductTypes);

// apply multer to this route
router.route('/create').post(upload.array('images', 4), createProduct);

router.route('/fetch-products').get(displayProducts);

router.route('/display/:id').get(renderSingleProduct).delete(deleteSingleProduct)

// router.route('/update/:id').put()

module.exports = router;