const express = require('express');
const router = express.Router();
const { getCategoryNames } = require('../controller/categoryController');


router.get('/',getCategoryNames);

module.exports = router;