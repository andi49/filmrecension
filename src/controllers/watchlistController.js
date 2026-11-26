// Hanterar användarens sparade filmer och ändringar i watchlisten.
const Watchlist = require("../models/Watchlist");


exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const movies = await Watchlist.getByUserId(userId);

    return res.status(200).json(movies);

  } catch (error) {
    return res.status(500).json({
      error: "Kunde inte hämta watchlist"
    });
  }
};


exports.addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = Number(req.body.movieId);

    if (!Number.isSafeInteger(movieId) || movieId <= 0) {
      return res.status(400).json({
        error: "Ogiltigt film-ID"
      });
    }

    const watchlist = new Watchlist(userId, movieId);
    const result = await watchlist.save();

    return res.status(201).json(result);

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "Filmen finns redan i din watchlist"
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({
        error: "Filmen finns inte"
      });
    }

    return res.status(500).json({
      error: "Kunde inte lägga till filmen"
    });
  }
};


exports.removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = Number(req.params.movieId);

    if (!Number.isSafeInteger(movieId) || movieId <= 0) {
      return res.status(400).json({
        error: "Ogiltigt film-ID"
      });
    }

    const deleted = await Watchlist.deleteByOwner(
      userId,
      movieId
    );

    if (!deleted) {
      return res.status(404).json({
        error: "Filmen finns inte i din watchlist"
      });
    }

    return res.status(200).json({
      message: "Filmen har tagits bort"
    });

  } catch (error) {
    return res.status(500).json({
      error: "Kunde inte ta bort filmen"
    });
  }
};