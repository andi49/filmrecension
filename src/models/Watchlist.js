const db = require("#config/db");

class Watchlist {
  constructor(userId, movieId) {
    this.userId = userId;
    this.movieId = movieId;
  }

  // Hämta användarens sparade filmer
  static async getByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT
        movies.id,
        movies.title,
        movies.genre,
        movies.release_year,
        watchlist.created_at
       FROM watchlist
       JOIN movies ON watchlist.movie_id = movies.id
       WHERE watchlist.user_id = ?
       ORDER BY watchlist.created_at DESC`,
      [userId]
    );

    return rows;
  }


  async save() {
    await db.execute(
      `INSERT INTO watchlist (user_id, movie_id)
       VALUES (?, ?)`,
      [this.userId, this.movieId]
    );

    return {
      userId: this.userId,
      movieId: this.movieId
    };
  }


  static async deleteByOwner(userId, movieId) {
    const [result] = await db.execute(
      `DELETE FROM watchlist
       WHERE user_id = ? AND movie_id = ?`,
      [userId, movieId]
    );

    return result.affectedRows > 0;
  }
}

module.exports = Watchlist;