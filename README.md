# FilmRecension

## About the Project

FilmRecension is a web application where users can browse movies, write reviews, rate movies and save movies to a personal watchlist.

The project consists of a REST API, a MySQL database and a frontend built with HTML, CSS and JavaScript.

## Features

- Register a user account.
- Log in and log out.
- Browse movies and view movie details.
- Read movie reviews.
- Create and edit personal reviews.
- Rate movies from 1 to 10.
- Add and remove movies from a personal watchlist.

## Technologies

- Node.js
- Express
- MySQL
- Docker and Docker Compose
- JWT
- bcrypt
- HTML, CSS and JavaScript

## Installation

Docker and Docker Compose must be installed to run the project.

1. Download and extract the project.
2. Open the project folder in your terminal.
3. Create a `.env` file based on `.env.example`.
4. Start the application:

```bash
docker compose up -d --build
```

5. Open the application in your browser:

http://localhost:3000

The database and four initial movies are automatically created when the database is initialized for the first time.

To stop the application:

```bash
docker compose down
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a user |
| POST | /api/auth/login | Log in |
| GET | /api/movies | Get all movies |
| GET | /api/movies/:id | Get a specific movie |
| GET | /api/movies/:id/reviews | Get movie reviews |
| POST | /api/movies/:id/reviews | Create a review |
| PUT | /api/reviews/:id | Edit your own review |
| GET | /api/watchlist | Get personal watchlist |
| POST | /api/watchlist | Add a movie to watchlist |
| DELETE | /api/watchlist/:movieId | Remove a movie from watchlist |

## Database

The project uses MySQL and contains four database tables:

- **users:** Stores user account information and hashed passwords.
- **movies:** Stores movie information.
- **reviews:** Stores user reviews and ratings.
- **watchlist:** Stores movies saved by users.

### ER Diagram

![ER Diagram](ER-diagram.png)

The reviews and watchlist tables are connected to the users and movies tables through foreign keys.

- **PK (Primary Key):** Uniquely identifies a record in a table.
- **FK (Foreign Key):** Creates a connection between tables.

The watchlist table uses a composite primary key to prevent users from saving the same movie more than once.

## Security

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Protected endpoints require authentication.
- Users can only edit their own reviews.
- Each user has a personal watchlist.
- Parameterized SQL queries are used to help prevent SQL injection.
- Sensitive information is stored in environment variables.

## Testing

The REST API and frontend have been tested manually. Registration, login, movie browsing, reviews and watchlist functionality have been tested.

The application has also been tested using two different user accounts.

## Project Purpose

The purpose of this project is to develop a functional REST API with a database, user authentication and a frontend that allows users to interact with the application.