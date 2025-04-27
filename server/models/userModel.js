const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
});

// Cart item schema
const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
});

// Define user schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, 'Please enter a valid phone number'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // You can adjust the minimum length if necessary
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'buyer', 'seller'],
    },
    addresses: [addressSchema],
    cart: [cartItemSchema], // NEW: User's Cart
}, {
    timestamps: true,
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Add to cart method
userSchema.methods.addToCart = async function (productId, quantity = 1) {
    const cartItemIndex = this.cart.findIndex(item => item.product.toString() === productId.toString());

    if (cartItemIndex > -1) {
        // Product already in cart, update quantity
        this.cart[cartItemIndex].quantity += quantity;
    } else {
        // New product
        this.cart.push({ product: productId, quantity });
    }

    await this.save();
};

// Clear cart method (after order created)
userSchema.methods.clearCart = async function () {
    this.cart = [];
    await this.save();
};

// Check if the model already exists to avoid overwriting
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
