
import "dotenv/config";
import express from "express";
import path from "node:path";

import reviewRoutes from "./src/routes/reviewRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import watchlistRoutes from "./src/routes/watchlistRoutes.js";
import db from "#config/db";

const app = express();

app.use(express.json());

// FRONTEND
app.use(express.static(path.join(process.cwd(), "public")));

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api", reviewRoutes);
app.use("/api", watchlistRoutes);

// HÄMTA ALLA FILMER
app.get("/api/movies", async (req, res) => {
  try {
    const [movies] = await db.execute(
      "SELECT id, title, genre, release_year FROM movies"
    );

    return res.status(200).json(movies);

  } catch (error) {
    console.error("Get movies error:", error);

    return res.status(500).json({
      error: "Kunde inte hämta filmer"
    });
  }
});

// HÄMTA EN FILM
app.get("/api/movies/:id", async (req, res) => {
  try {
    const movieId = Number(req.params.id);

    if (!Number.isSafeInteger(movieId) || movieId <= 0) {
      return res.status(400).json({
        error: "Ogiltigt film-ID"
      });
    }

    const [movies] = await db.execute(
      "SELECT id, title, genre, release_year FROM movies WHERE id = ?",
      [movieId]
    );

    if (movies.length === 0) {
      return res.status(404).json({
        error: "Filmen finns inte"
      });
    }

    return res.status(200).json(movies[0]);

  } catch (error) {
    console.error("Get movie error:", error);

    return res.status(500).json({
      error: "Kunde inte hämta filmen"
    });
  }
});

// STARTA SERVERN
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
