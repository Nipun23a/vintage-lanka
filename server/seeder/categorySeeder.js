const mongoose = require('mongoose');
const Category = require('../models/categoryModel'); // Adjust the path according to your project structure

// MongoDB URI (replace with your own connection string)
const uri = 'mongodb+srv://hasangasachinthani2001:sNg9OIhVy3g4RuFj@cluster0.7jzsypp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const categories = [
    {
        name: 'Electronics',
        description: 'Used electronic items like smartphones, laptops, etc.',
    },
    {
        name: 'Furniture',
        description: 'Pre-owned furniture for home and office.',
    },
    {
        name: 'Clothing',
        description: 'Second-hand clothing in great condition.',
    },
    {
        name: 'Toys',
        description: 'Used toys for kids of all ages.',
    },
    {
        name: 'Books',
        description: 'Second-hand books in various genres.',
    },
    {
        name: 'Sports Equipment',
        description: 'Gently used sports gear and equipment.',
    },
    {
        name: 'Appliances',
        description: 'Used household appliances like refrigerators, washing machines, etc.',
    },
    {
        name: 'Automotive',
        description: 'Pre-owned automotive accessories, parts, and more.',
    },
    {
        name: 'Home Decor',
        description: 'Pre-loved home decor items.',
    },
];

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Database connected');

        // Clear existing categories (optional)
        await Category.deleteMany({});

        // Insert categories
        await Category.insertMany(categories);
        console.log('Categories have been seeded successfully');

        // Close the database connection
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });
