const Category = require('../models/categoryModel'); // adjust path if needed

exports.getCategoryNames = async (req, res) => {
    try {
        const categories = await Category.find({}, 'name'); // Only select 'name' field

        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};
