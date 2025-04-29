const mongoose = require('mongoose');
const User = require('../models/userModel'); // Adjust the path if needed
const bcrypt = require('bcryptjs');

// MongoDB URI (replace with your own connection string)
const uri = 'mongodb+srv://hasangasachinthani2001:sNg9OIhVy3g4RuFj@cluster0.7jzsypp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Pre-hash the passwords
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

async function seedUsers() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected');

        // Clear existing users (optional)
        await User.deleteMany({});

        // Create users
        const users = [
            {
                fullname: 'Admin User',
                email: 'admin@example.com',
                phoneNumber: '1234567890',
                password: await hashPassword('password123'), // Plain password is 'password123'
                role: 'admin',
                addresses: [
                    {
                        street: '123 Admin St',
                        city: 'Admin City',
                        state: 'Admin State',
                        zipCode: '12345',
                        country: 'Adminland',
                    },
                ],
                profileImage: '', // Admin doesn't need profileImage
            },
            {
                fullname: 'Seller User',
                email: 'seller@example.com',
                phoneNumber: '0987654321',
                password: await hashPassword('password123'), // Plain password is 'password123'
                role: 'seller',
                addresses: [
                    {
                        street: '456 Seller Blvd',
                        city: 'Sellertown',
                        state: 'Seller State',
                        zipCode: '67890',
                        country: 'Sellerland',
                    },
                ],
                profileImage: 'https://firebasestorage.googleapis.com/v0/b/vintage-lanka.firebasestorage.app/o/profile-images%2Fseller-user.jpg?alt=media&token=990a2ecc-6a18-45d8-9fd8-709a31b808b2', // Required for seller
            },
        ];

        // Insert users
        await User.insertMany(users);
        console.log('Users have been seeded successfully');

        // Close the connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding users:', error);
        mongoose.connection.close();
    }
}

// Run the seed function
seedUsers();
