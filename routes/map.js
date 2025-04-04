const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

// Route for the home page
router.get('/', mapController.showMap);

module.exports = router;