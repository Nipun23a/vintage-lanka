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

async function seedBuyer() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected');

        // Optionally clear buyers only (not touching admins or sellers)
        await User.deleteMany({ role: 'buyer' });

        // Create buyer user
        const buyers = [
            {
                fullname: 'Buyer User',
                email: 'buyer@example.com',
                phoneNumber: '1122334455',
                password: await hashPassword('password123'), // Plain password is 'password123'
                role: 'buyer',
                addresses: [
                    {
                        street: '789 Buyer Road',
                        city: 'Buyertown',
                        state: 'Buyer State',
                        zipCode: '54321',
                        country: 'Buyerland',
                    },
                ],
                profileImage: '', // Buyers don't require a profile image
            },
        ];

        // Insert buyer
        await User.insertMany(buyers);
        console.log('Buyer has been seeded successfully');

        // Close the connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding buyer:', error);
        mongoose.connection.close();
    }
}

// Run the seed function
seedBuyer();
