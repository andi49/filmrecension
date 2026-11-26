
// Läser och sparar användarkonton i databasen.
const db = require("#config/db");

class User {
  constructor(email, passwordHash) {
    this.email = email;
    this.passwordHash = passwordHash;
  }

  static async findByEmail(email) {
  const [rows] = await db.execute(
    "SELECT id, email, password_hash FROM users WHERE email = ?",
    [email]
  );

  return rows[0] || null;
}

  async save() {
    const [result] = await db.execute(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [this.email, this.passwordHash]
    );

    return {
      id: result.insertId,
      email: this.email
    };
  }
}

module.exports = User;
