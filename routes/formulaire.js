const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/formController");

router.get("/", reviewController.showForm);
router.get("/add", reviewController.showForm);
router.post("/add", reviewController.submitReview);

module.exports = router;
