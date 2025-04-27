const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
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

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
