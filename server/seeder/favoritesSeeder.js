const mongoose = require('mongoose');
const User = require('../models/userModel');
const Product = require('../models/productModel'); // Add Product model import

// MongoDB URI - replace with your actual URI if different
const uri = 'mongodb+srv://hasangasachinthani2001:sNg9OIhVy3g4RuFj@cluster0.7jzsypp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// User ID to add favorites to
const userId = '68103ef43ebc5dc2a11cea3f';

async function seedFavorites() {
    try {
        // Connect to the database
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully');

        // Find the user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        
        console.log(`Found user: ${user.fullname}`);
        
        // Find the "Vintage Sofa" product by title
        const product = await Product.findOne({ title: 'Vintage Sofa' });
        
        if (!product) {
            throw new Error('Vintage Sofa product not found');
        }
        
        console.log(`Found product: ${product.title} with ID: ${product._id}`);
        
        // Check if the product is already in favorites
        const isAlreadyFavorite = user.favourites.some(
            favId => favId.toString() === product._id.toString()
        );
        
        if (isAlreadyFavorite) {
            console.log('Product is already in favorites');
        } else {
            // Add the product to favorites
            await user.addToFavourites(product._id);
            console.log(`Product "${product.title}" added to favorites successfully`);
        }
        
        // Display updated favorites list
        const updatedUser = await User.findById(userId).populate('favourites');
        console.log('Updated favorites list:');
        updatedUser.favourites.forEach(fav => {
            console.log(`- ${fav.title || fav._id}`);
        });
        
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
        
    } catch (error) {
        console.error('Error seeding favorites:', error);
        
        // Ensure database connection is closed even if there's an error
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log('Database connection closed after error');
        }
    }
}

// Run the seeder function
seedFavorites().catch(error => {
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