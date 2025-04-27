const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
    addToCart,
    clearCart,
    getCart
} = require('../controller/userController');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user by ID
router.get('/:id', getUserById);

// Update user by ID
router.put('/:id', updateUser);

// Delete user by ID
router.delete('/:id', deleteUser);

// Add item to user's cart
router.post('/:userId/cart', addToCart);

// View user's cart
router.get('/:userId/cart', getCart);

// Clear user's cart
router.delete('/:userId/cart', clearCart);

module.exports = router;
