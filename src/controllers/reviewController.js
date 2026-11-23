const Review = require("../models/Review");
const db = require("#config/db");


class ReviewController {

    static async getByMovie(req, res) {
        try {
            const movieId = Number(req.params.movieId)

            if(!Number.isSafeInteger(movieId) || movieId <= 0) {
                return res.status(400).json({error: 'OGILTIGT FILM-ID'})
            }

            const [movies] = await db.execute("SELECT id FROM movies WHERE id = ?",[movieId])

           if (movies.length === 0) {
              return res.status(404).json({
                  error: "FILMEN FINNS INTE"
              });
          }

            const reviews = await Review.getByMovieId(movieId)

            return res.status(200).json(reviews)
        } catch (error) {
            console.error('HÄMTA REVIEWS ERROR:', error)

            return res.status(500).json({
                error: 'KUNDE INTE HÄMTA RECENSIONER'
            })
        }
    }

    static async create(req, res) {
    try {
      const movieId = Number(req.params.movieId);
      const { rating, comment } = req.body || {};

  
      if (!Number.isSafeInteger(movieId) || movieId <= 0) {
        return res.status(400).json({
          error: "Ogiltigt film-ID"
        });
      }

     
      if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
        return res.status(400).json({
          error: "Betyget måste vara ett heltal mellan 1 och 10"
        });
      }

      
      if (
        typeof comment !== "string" ||
        comment.trim().length === 0 ||
        comment.length > 2000
      ) {
        return res.status(400).json({
          error: "Kommentaren måste vara mellan 1 och 2000 tecken"
        });
      }

     
      const [movies] = await db.execute("SELECT id FROM movies WHERE id = ?",[movieId]);

      if (movies.length === 0) {
        return res.status(404).json({
          error: "Filmen finns inte"
        });
      }

    
      const review = new Review(
        req.user.id,
        movieId,
        rating,
        comment.trim()
      );

      const savedReview = await review.save();

      return res.status(201).json({
        message: "Recension skapad!",
        review: savedReview
      });

    } catch (error) {

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          error: "Du har redan recenserat den här filmen"
        });
      }

      console.error("Create review error:", error);

      return res.status(500).json({
        error: "Kunde inte skapa recensionen"
      });
    }
  }


static async update(req, res) {
  try {
    const reviewId = Number(req.params.id);
    const { rating, comment } = req.body || {};

   
    if (!Number.isSafeInteger(reviewId) || reviewId <= 0) {
      return res.status(400).json({
        error: "Ogiltigt recensions-ID"
      });
    }

  
    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
      return res.status(400).json({
        error: "Betyget måste vara ett heltal mellan 1 och 10"
      });
    }

   
    if (
      typeof comment !== "string" ||
      comment.trim().length === 0 ||
      comment.length > 2000
    ) {
      return res.status(400).json({
        error: "Kommentaren måste vara mellan 1 och 2000 tecken"
      });
    }

   
    const updated = await Review.updateByOwner(
      reviewId,
      req.user.id,
      rating,
      comment.trim()
    );

    if (!updated) {
      return res.status(404).json({
        error: "Recensionen finns inte eller tillhör en annan användare"
      });
    }

    return res.status(200).json({
      message: "Recension uppdaterad!"
    });

  } catch (error) {
    console.error("Update review error:", error);

    return res.status(500).json({
      error: "Kunde inte uppdatera recensionen"
    });
  }
}

}

module.exports = ReviewController;