CREATE DATABASE IF NOT EXISTS filmrecension

USE filmrecension

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
)


CREATE TABLE IF NOT EXISTS movies(
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  release_year INT NOT NULL
)


CREATE TABLE IF NOT EXISTS reviews(
   id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT NOT NULL,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 10),
  UNIQUE (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id) 
)


CREATE TABLE IF NOT EXISTS watchlist (
  user_id INT NOT NULL,
  movie_id INT NOT NULL,

  PRIMARY KEY (user_id, movie_id),

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

INSERT INTO movies (title, genre, release_year)
VALUES
  ('Inception', 'Sci-Fi', 2010),
  ('Titanic', 'Drama', 1997),
  ('Interstellar', 'Sci-Fi', 2014);
