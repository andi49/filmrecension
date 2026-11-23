const db = require("#config/db");

class Reviews {
    constructor(userId, movieId, rating, comment) {
        this.userId = userId
        this.movieId = movieId
        this.rating = rating
        this.comment = comment
    }


static async updateByOwner(reviewId, userId, rating, comment) {
  const [result] = await db.execute(
    `UPDATE reviews
     SET rating = ?, comment = ?
     WHERE id = ? AND user_id = ?`,
    [rating, comment, reviewId, userId]
  );

  return result.affectedRows > 0;
}


   
  static async getByMovieId(movieId) {
    const [rows] = await db.execute(
      `SELECT
        reviews.id,
        reviews.movie_id,
        reviews.rating,
        reviews.comment,
        users.email AS reviewer
       FROM reviews
       JOIN users ON reviews.user_id = users.id
       WHERE reviews.movie_id = ?
       ORDER BY reviews.id DESC`,
      [movieId]
    );

    return rows;
  }

 
  async save() {
    const [result] = await db.execute(
      `INSERT INTO reviews
       (user_id, movie_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [
        this.userId,
        this.movieId,
        this.rating,
        this.comment
      ]
    );

    return {
      id: result.insertId,
      userId: this.userId,
      movieId: this.movieId,
      rating: this.rating,
      comment: this.comment
    };
  }
}

module.exports = Reviews