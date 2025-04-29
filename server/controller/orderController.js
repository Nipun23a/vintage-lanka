const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');

// Create a new Order
exports.createOrder = async (req, res) => {
    try {
        const { buyer, orderItems, shippingAddress, totalAmount } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        const order = new Order({
            buyer,
            orderItems,
            shippingAddress,
            totalAmount,
        });

        const savedOrder = await order.save();
        res.status(201).json({ message: 'Order created successfully', order: savedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
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