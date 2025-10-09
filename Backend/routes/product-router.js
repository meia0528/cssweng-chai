const express = require('express')
const router = express.Router()
const upload = require('../config/multer.js');
const {getProductTypes, createProduct} = require('../controllers/product-controller.js')


router.route('/product-types').get(getProductTypes);

// apply multer to this route
router.route('/create').post(upload.array('images', 4), createProduct);

// router.route('/display').get();

// router.route('/display/:id').get().delete()

// router.route('/update/:id').put()

module.exports = router;