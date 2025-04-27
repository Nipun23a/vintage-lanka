const express = require('express');
const router = express.Router();
const {
    createOrder,
    updateOrderStatus,
    getOrdersBySeller
} = require('../controller/orderController');

// Create Order
router.post('/', createOrder);

// Update Order Status
router.patch('/:orderId', updateOrderStatus);

// Get Orders by Seller
router.get('/seller/:sellerId', getOrdersBySeller);

module.exports = router;
