const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/auth-Middleware');
const { listSales, createSale, deleteSale } = require('../controllers/sales-controller');

// All routes require admin token
router.get('/', verifyAdmin, listSales);
router.post('/', verifyAdmin, createSale);
router.delete('/:id', verifyAdmin, deleteSale);

module.exports = router;
