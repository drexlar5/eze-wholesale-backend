const express = require('express');
const router = express.Router();
const productController = require('../controller/products');

router.get('/', (_req, res) => res.send('Welcome to Ese Wholesale Service'));

router.get('/products', productController.getProducts);

router.post('/products', productController.saveProducts);

module.exports = router;