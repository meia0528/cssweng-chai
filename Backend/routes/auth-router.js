const express = require('express')
const router = express.Router();
const {registerAdmin, loginAdmin, checkAdminExist} = require('../controllers/auth-controller.js');

router.route('/register').post(registerAdmin);
router.route('/login').post(loginAdmin);
router.route('/admin-exists').get(checkAdminExist);

module.exports = router;