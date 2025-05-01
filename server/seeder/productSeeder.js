const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');

// MongoDB URI
const uri = 'mongodb+srv://hasangasachinthani2001:sNg9OIhVy3g4RuFj@cluster0.7jzsypp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function seedProducts() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected');

        // Fetch categories
        const furnitureCategory = await Category.findOne({ name: 'Furniture' });
        const clothingCategory = await Category.findOne({ name: 'Clothing' });

        if (!furnitureCategory || !clothingCategory) {
            throw new Error('Required categories not found');
        }

        // Clear existing products (optional)
        await Product.deleteMany({});

        // Define products with VALID 24-character ObjectIds
        const sellerId = new mongoose.Types.ObjectId('68103b7e824c0dc5a355d69a'); // Added missing character
        const buyerId = new mongoose.Types.ObjectId('68103ef43ebc5dc2a11cea3f'); // This one is correct length
       
        // Create products
        const product1 = new Product({
            title: 'Vintage Sofa',
            description: 'A cozy, lightly-used vintage sofa.',
            category: furnitureCategory._id,
            quantity: 5,
            price: 150.00,
            discountPrice: 120.00,
            images: [
                'https://firebasestorage.googleapis.com/v0/b/vintage-lanka.firebasestorage.app/o/items%2F3sofa2.jpg?alt=media&token=dae41e11-50d1-4f76-8086-a503e3808237',
                'https://firebasestorage.googleapis.com/v0/b/vintage-lanka.firebasestorage.app/o/items%2F3sofa.jpg?alt=media&token=36909793-ff33-4992-8281-3655d8a3ae44'
            ],
            mainImage: 'https://firebasestorage.googleapis.com/v0/b/vintage-lanka.firebasestorage.app/o/items%2F3sofa2.jpg?alt=media&token=dae41e11-50d1-4f76-8086-a503e3808237',
            seller: sellerId
        });

        const product2 = new Product({
            title: 'Denim Jacket',
            description: 'Stylish second-hand denim jacket in good condition.',
            category: clothingCategory._id,
            quantity: 10,
            price: 40.00,
            discountPrice: 30.00,
            images: [
                'https://firebasestorage.googleapis.com/v0/b/vintage-lanka.firebasestorage.app/o/items%2Fjackets.jpg?alt=media&token=418ebb6f-5d7e-4176-85e1-ddc3b13f9e8e'
            ],
            mainImage: 'https://firebasestorage.googleapis.com/v0/b/vintage-lanka.firebasestorage.app/o/items%2Fjackets.jpg?alt=media&token=418ebb6f-5d7e-4176-85e1-ddc3b13f9e8e',
            seller: sellerId
        });

        // Save products
        await product1.save();
        await product2.save();

        // Create reviews for the products by the buyer
        const review1 = {
            user: buyerId,
            rating: 5,
            comment: 'This sofa is amazing! Comfortable and stylish. Totally worth the price!',
        };

        const review2 = {
            user: buyerId,
            rating: 4,
            comment: 'Great jacket, a bit tight on me, but still love it! Good quality.',
        };

        // Add reviews to products
        product1.reviews.push(review1);
        product2.reviews.push(review2);

        // Save products with reviews
        await product1.save();
        await product2.save();

        console.log('Products with reviews seeded successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding products:', error);
        mongoose.connection.close();
    }
}

// Run the seed function
seedProducts();