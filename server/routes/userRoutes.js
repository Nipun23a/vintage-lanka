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
    getCart, updatePassword, addFavourite, getFavourite,removeFavourite,
    updateCartQuantity,
    getAddresses,
    createAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    updateUserAddresses
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

// Update the quantity cart
//router.patch('/:userId/cart',updateCartQuantity);

// Route for updating password
router.patch('/:userId/password', updatePassword);

// Route for get favourite
router.get('/:userId/favourites',getFavourite);

// Route for adding product to favourites
router.post('/:userId/favourites/:productId', addFavourite);

router.delete('/:userId/favourites/:productId', removeFavourite);

router.post('/:id/addresses', addAddress);
router.put('/:userId/addresses/:addressId', updateAddress);
router.delete('/:userId/addresses/:addressId', deleteAddress);
router.put('/:id/addresses', updateUserAddresses);
router.get('/:userId/addresses', getAddresses);
router.post('/:userId/addresses', createAddress);

router.put('/:userId/addresses/:addressId', updateAddress);
router.delete('/:userId/addresses/:addressId',deleteAddress);


module.exports = router;
