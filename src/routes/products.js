const express = require('express');
const router = express.Router();
const productController = require('../controller/products');

router.get('/', (req, res, next) => res.send('Welcome to Ese Wholesale Service'));

router.get('/products', productController.getProducts);
router.get('/products/search', productController.searchProducts);

router.post('/products', productController.saveProducts);

module.exports = router;