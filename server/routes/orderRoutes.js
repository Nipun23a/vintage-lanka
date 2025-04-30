const express = require('express');
const router = express.Router();
const {
    createOrder,
    updateOrderStatus,
    getOrdersBySeller, getOrdersByUser,getSellerOrderSummary
} = require('../controller/orderController');

// Create Order
router.post('/', createOrder);

// Update Order Status
router.patch('/:orderId', updateOrderStatus);

// Get Orders by Seller
router.get('/:sellerId/seller', getOrdersBySeller);
router.get('/:userId/transactions',getOrdersByUser);
router.get('/summary/:sellerId', getSellerOrderSummary);

module.exports = router;
