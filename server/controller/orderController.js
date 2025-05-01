const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const mongoose = require('mongoose');

// Create a new Order
exports.createOrder = async (req, res) => {
    try {
        const { buyer, orderItems, shippingAddress, totalAmount, paymentStatus, orderStatus } = req.body;
        
        // Validate required fields
        if (!buyer) {
            return res.status(400).json({ message: 'Buyer ID is required' });
        }
        
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }
        
        if (!shippingAddress) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }
        
        // Validate shipping address
        const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'country'];
        for (const field of requiredAddressFields) {
            if (!shippingAddress[field]) {
                return res.status(400).json({ message: `Shipping address ${field} is required` });
            }
        }
        
        // No need to transform orderItems as frontend is now sending correct format
        // with 'product' field instead of 'productId'
        
        // Create new order with the provided data
        const order = new Order({
            buyer,
            orderItems,
            shippingAddress,
            totalAmount,
            paymentStatus: paymentStatus || 'Pending',
            orderStatus: orderStatus || 'Pending'
        });
        
        const savedOrder = await order.save();
        
        // Return detailed response with order data
        res.status(201).json({
            message: 'Order created successfully',
            order: savedOrder
        });
    } catch (error) {
        console.log('Error creating order:', error);
        
        // Check for validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        
        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;  // Get orderId from route params
    const { status } = req.body;  // Get the new status from the request body

    try {
        // Find the order by its ID
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the status is valid
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Update the order status
        order.orderStatus = status;

        // Save the updated order
        await order.save();

        // Respond with the updated order
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Orders for a Specific Seller
exports.getOrdersBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;

        // Step 1: Find all products of this seller
        const sellerProducts = await Product.find({ seller: sellerId }).select('_id');
        const productIds = sellerProducts.map(product => product._id);

        if (productIds.length === 0) {
            return res.status(404).json({ message: 'No products found for this seller' });
        }

        // Step 2: Find orders containing these products
        const orders = await Order.find({
            'orderItems.product': { $in: productIds }
        })
            .populate('buyer', 'fullname phoneNumber')
            .populate('orderItems.product', 'title price')
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seller orders', error: error.message });
    }
};

// Get all orders for a specific user
exports.getOrdersByUser = async (req,res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ buyer: userId })
            .populate('orderItems.product')
            .populate('buyer', 'fullname email')
            .sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        res.status(200).json(orders);

    }catch (error){
        console.log('Error fetching orders for users:',error);
        res.status(500).json({message:'Server error while fetching orders'})
    }
};


exports.getSellerOrderSummary = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        console.log(sellerId);
               
        // Validate the seller exists
        const seller = await User.findById(sellerId);
        if (!seller) {
            return res.status(400).json({ message: 'Invalid seller ID.' });
        }
        
        // Step 1: Find all products of this seller
        const sellerProducts = await Product.find({ seller: sellerId }).select('_id');
        const productIds = sellerProducts.map(product => product._id.toString());
        const productCount = sellerProducts.length;
        if (productIds.length === 0) {
            return res.status(404).json({ message: 'No products found for this seller' });
        }
        
        // Step 2: Find orders containing these products
        const orders = await Order.find({
            'orderItems.product': { $in: productIds }
        });
        
        // Step 3: Calculate total orders and revenue
        let totalRevenue = 0;
        let orderCount = 0;
        
        // Create a set to track unique order IDs
        const uniqueOrderIds = new Set();
        
        // Process each order
        orders.forEach(order => {
            // Add this order ID to our set of unique orders
            uniqueOrderIds.add(order._id.toString());
            
            // Calculate revenue from this seller's products in this order
            order.orderItems.forEach(item => {
                // Check if this item is from our seller
                
                if (productIds.includes(item.product.toString())) {
                    totalRevenue += (item.price * item.quantity);
                }
            });
        });
        
        // Get the total count of unique orders
        orderCount = uniqueOrderIds.size;
       
        res.status(200).json({
            message: 'Seller order summary retrieved successfully',
            data: {
                productCount,
                orderCount,
                totalRevenue: parseFloat(totalRevenue.toFixed(2))
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Error retrieving seller order summary', error: error.message });
    }
};

