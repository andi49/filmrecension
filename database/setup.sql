CREATE DATABASE IF NOT EXISTS filmrecension
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

USE filmrecension;

-- =====================================
-- USERS
-- =====================================

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- MOVIES
-- =====================================

CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  release_year INT DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  genre VARCHAR(50) DEFAULT NULL,
  poster_url VARCHAR(500) DEFAULT NULL,

  CONSTRAINT unique_movie UNIQUE (title, release_year)
);

-- =====================================
-- REVIEWS
-- =====================================

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 10),

  UNIQUE (user_id, movie_id),

  FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,

  FOREIGN KEY (movie_id)
    REFERENCES movies(id) ON DELETE CASCADE
);

-- =====================================
-- WATCHLIST
-- =====================================

CREATE TABLE IF NOT EXISTS watchlist (
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id, movie_id),

  FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,

  FOREIGN KEY (movie_id)
    REFERENCES movies(id) ON DELETE CASCADE
);

-- =====================================
-- SEED DATA
-- =====================================

INSERT INTO movies (title, description, release_year, genre)
VALUES
  ('Interstellar', 'A journey through space', 2014, 'Sci-Fi'),
  ('Inception', 'A world inside dreams', 2010, 'Sci-Fi'),
  ('The Dark Knight', 'Batman faces the Joker', 2008, 'Action'),
  ('The Matrix', 'A simulated reality', 1999, 'Sci-Fi')
ON DUPLICATE KEY UPDATE title = movies.title;