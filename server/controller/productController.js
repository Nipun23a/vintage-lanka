const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const User = require('../models/UserModel');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { title, description, category, quantity, price, discountPrice, seller, images, mainImage } = req.body;
        
        // Validate required fields
        if (!mainImage) {
            return res.status(400).json({ message: 'Main image is required.' });
        }
        
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(400).json({ message: 'Invalid category ID.' });
        }
        
        const existingSeller = await User.findById(seller);
        if (!existingSeller) {
            return res.status(400).json({ message: 'Invalid seller ID.' });
        }
        
        const newProduct = new Product({
            title,
            description,
            category,
            quantity,
            price,
            discountPrice,
            images,
            mainImage, // Include the mainImage field
            seller,
        });
        
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', productId: newProduct._id });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name') // assuming Category model has a 'name' field
            .populate('seller', 'username email') // adjust fields as needed

        res.status(200).json({
            message: 'Products retrieved successfully',
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving products',
            error: error.message,
        });
    }
};

// Get all products by seller ID
exports.getProductsBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const products = await Product.find({ seller: sellerId }).populate('category', 'name');

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Get a single product by product ID
exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId)
            .populate('category', 'name')
            .populate('seller', 'fullname phoneNumber profileImage');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};



