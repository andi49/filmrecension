const express = require("express");
const ReviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Hämta recensioner för en film
router.get("/movies/:movieId/reviews",ReviewController.getByMovie);
// Skapa recension för en film
router.post("/movies/:movieId/reviews",authMiddleware,ReviewController.create);

router.put( "/reviews/:id",authMiddleware,ReviewController.update);

module.exports = router;
