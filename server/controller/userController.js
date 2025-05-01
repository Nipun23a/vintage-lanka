const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role, addresses, profileImage } = req.body;

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Check if phone number already exists
        const existingPhone = await User.findOne({ phoneNumber });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already registered.' });
        }

        // Build new user data object
        const newUserData = { fullname, email, phoneNumber, password, role, addresses };

        // Include profileImage only if provided
        if (profileImage) {
            newUserData.profileImage = profileImage;
        }

        const newUser = new User(newUserData);
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};



// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('cart.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, role, addresses, profileImage } = req.body;

        // Build the update object conditionally
        const updateData = {
            fullname,
            email,
            phoneNumber,
            role,
            addresses,
        };

        // Only add profileImage if it's provided in the request
        if (profileImage) {
            updateData.profileImage = profileImage;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.addToCart(productId, quantity || 1);

        res.status(200).json({ message: 'Product added to cart successfully', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

// Clear user's cart (after order is created)
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.clearCart();

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
};

// View user's cart
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('cart.product', 'title price mainImage');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// Updated password function
exports.updatePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the old password is correct
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error: error.message });
        console.log(error.message);
    }
};

// Add to Favourites function
exports.addFavourite = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the product to the favourites if it's not already there
        if (!user.favourites.includes(productId)) {
            user.favourites.push(productId);
            await user.save();
            res.status(200).json({ message: 'Product added to favourites' });
        } else {
            res.status(400).json({ message: 'Product is already in favourites' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to favourites', error: error.message });
    }
};


// Get Favourite function
exports.getFavourite = async (req,res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId).populate({
            path:'favourites',
            select:'title mainImage price',
        });

        if (!user){
            return res.status(404).json({message:'User not found'});
        }
        res.status(200).json({favourites:user.favourites});
    }catch (error){
        console.log('Error fetching favourites :',error);
        res.status(500).json({message:'Error fetching favourites'})
    }
};

// Remove from favourites function
exports.removeFavourite = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.favourites.indexOf(productId);
        if (index > -1) {
            user.favourites.splice(index, 1);
            await user.save();
            res.status(200).json({ message: 'Product removed from favourites' });
        } else {
            res.status(400).json({ message: 'Product not found in favourites' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error removing product from favourites', error: error.message });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { street, city, state, zipCode, country } = req.body;

        // Validate required fields
        if (!street || !city || !state || !zipCode || !country) {
            return res.status(400).json({ message: 'All address fields are required' });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new address
        const newAddress = {
            street,
            city,
            state,
            zipCode,
            country
        };

        // Add address to user's addresses array
        user.addresses.push(newAddress);
        await user.save();

        // Return the new address with its ID
        const addedAddress = user.addresses[user.addresses.length - 1];
        
        res.status(201).json({ 
            message: 'Address added successfully',
            address: addedAddress
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error adding address', 
            error: error.message 
        });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const { street, city, state, zipCode, country } = req.body;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the address in the user's addresses array
        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Update address fields if provided
        if (street !== undefined) address.street = street;
        if (city !== undefined) address.city = city;
        if (state !== undefined) address.state = state;
        if (zipCode !== undefined) address.zipCode = zipCode;
        if (country !== undefined) address.country = country;

        // Save the updated user
        await user.save();

        res.status(200).json({
            message: 'Address updated successfully',
            address: address
        });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({
            message: 'Error updating address',
            error: error.message
        });
    }
};


exports.deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the address
        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Remove the address - IMPORTANT: Use pull for Mongoose subdocuments
        user.addresses.pull(addressId);
        
        // Save the updated user
        await user.save();

        res.status(200).json({
            message: 'Address deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({
            message: 'Error deleting address',
            error: error.message
        });
    }
};










