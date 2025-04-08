const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placesController');

router.get('/', placeController.getAllPlaces);
router.post('/', placeController.createPlace);
router.get('/nearby', placeController.findNearby);
router.put('/:id', placeController.updatePlace);
router.delete('/:id', placeController.deletePlace);

module.exports = router;
