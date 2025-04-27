// ProductModel.js
const mongoose = require('mongoose');
const Category = require('./CategoryModel');
const User = require('./UserModel');

// Define review schema for product reviews
const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Define product schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        default: 0,
    },
    images: [{
        type: String,
        required: true,
    }],
    mainImage: {
        type: String,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reviews: [reviewSchema],
}, {
    timestamps: true,
});

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
