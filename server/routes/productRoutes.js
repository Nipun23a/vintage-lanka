const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProductsBySeller,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts
} = require('../controller/productController');
router.get('/',getAllProducts);
// Create a new product
router.post('/', createProduct);


// Get all products by seller ID
router.get('/seller/:sellerId', getProductsBySeller);

// Get a single product by product ID
router.get('/:productId', getProductById);

// Update a product by product ID
router.put('/:productId', updateProduct);

// Delete a product by product ID
router.delete('/:productId', deleteProduct);

module.exports = router;
