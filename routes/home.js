const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Route for the home page
router.get('/', homeController.getHomeData);

module.exports = router;