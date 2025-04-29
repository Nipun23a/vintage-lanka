const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// MongoDB URI - use the same connection string from your other seeders
const uri = 'mongodb+srv://hasangasachinthani2001:sNg9OIhVy3g4RuFj@cluster0.7jzsypp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Buyer ID - using the same user ID from your previous example
const buyerId = '68103ef43ebc5dc2a11cea3f';

async function seedOrders() {
    try {
        // Connect to the database
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully');

        // Find the buyer
        const buyer = await User.findById(buyerId);
        if (!buyer) {
            throw new Error(`Buyer with ID ${buyerId} not found`);
        }
        console.log(`Found buyer: ${buyer.fullname}`);

        // Find products to add to the order
        const vintageProduct = await Product.findOne({ title: 'Vintage Sofa' });
        const denimProduct = await Product.findOne({ title: 'Denim Jacket' });

        if (!vintageProduct || !denimProduct) {
            throw new Error('Required products not found');
        }
        console.log(`Found products: ${vintageProduct.title}, ${denimProduct.title}`);

        // Create sample orders
        const order1 = new Order({
            buyer: buyerId,
            orderItems: [
                {
                    product: vintageProduct._id,
                    quantity: 1,
                    price: vintageProduct.discountPrice || vintageProduct.price,
                },
                {
                    product: denimProduct._id,
                    quantity: 2,
                    price: denimProduct.discountPrice || denimProduct.price,
                }
            ],
            shippingAddress: {
                street: '123 Vintage Lane',
                city: 'Colombo',
                state: 'Western Province',
                zipCode: '10300',
                country: 'Sri Lanka',
            },
            totalAmount: (vintageProduct.discountPrice || vintageProduct.price) + 
                        2 * (denimProduct.discountPrice || denimProduct.price),
            paymentStatus: 'Paid',
            orderStatus: 'Shipped',
        });

        const order2 = new Order({
            buyer: buyerId,
            orderItems: [
                {
                    product: denimProduct._id,
                    quantity: 1,
                    price: denimProduct.discountPrice || denimProduct.price,
                }
            ],
            shippingAddress: {
                street: '456 Fashion Avenue',
                city: 'Kandy',
                state: 'Central Province',
                zipCode: '20000',
                country: 'Sri Lanka',
            },
            totalAmount: (denimProduct.discountPrice || denimProduct.price),
            paymentStatus: 'Pending',
            orderStatus: 'Processing',
        });

        // Clear existing orders for this buyer (optional - remove if you want to keep existing orders)
        await Order.deleteMany({ buyer: buyerId });
        console.log('Deleted existing orders for this buyer');

        // Save the orders
        await order1.save();
        await order2.save();
        console.log('Sample orders created successfully');

        // Fetch and display the created orders
        const orders = await Order.find({ buyer: buyerId })
            .populate('buyer', 'fullname email')
            .populate('orderItems.product', 'title price');

        console.log('\nCreated Orders:');
        orders.forEach((order, index) => {
            console.log(`\nOrder ${index + 1}:`);
            console.log(`Order ID: ${order._id}`);
            console.log(`Buyer: ${order.buyer.fullname}`);
            console.log(`Status: ${order.orderStatus}`);
            console.log(`Payment: ${order.paymentStatus}`);
            console.log(`Total Amount: $${order.totalAmount.toFixed(2)}`);
            console.log('Items:');
            order.orderItems.forEach(item => {
                console.log(`- ${item.quantity}x ${item.product.title} @ $${item.price.toFixed(2)}`);
            });
            console.log(`Shipping to: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`);
        });

        // Close the database connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');

    } catch (error) {
        console.error('Error seeding orders:', error);
        
        // Ensure database connection is closed even if there's an error
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log('Database connection closed after error');
        }
    }
}

// Run the seeder function
seedOrders().catch(error => {
    console.error('Unhandled error:', error);
    if (mongoose.connection.readyState !== 0) {
        mongoose.connection.close()
            .then(() => console.log('Database connection closed after unhandled error'))
            .catch(err => console.error('Error closing database connection:', err))
            .finally(() => process.exit(1));
    } else {
        process.exit(1);
    }
});