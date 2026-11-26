// Definierar inloggningsskyddade API-rutter för watchlisten.
const express = require("express");
const router = express.Router();

const watchlistController = require("../controllers/watchlistController");
const authMiddleware = require("../middleware/authMiddleware");

// Hämta användarens watchlist
router.get(
  "/watchlist",
  authMiddleware,
  watchlistController.getWatchlist
);

// Lägg till en film
router.post(
  "/watchlist",
  authMiddleware,
  watchlistController.addToWatchlist
);

// Ta bort en film
router.delete(
  "/watchlist/:movieId",
  authMiddleware,
  watchlistController.removeFromWatchlist
);

module.exports = router