require('dotenv').config()
const db = require("./db");

const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.json({message: 'FILMRECENSION IS UP!'})
})


app.get("/api/movies", async (req, res) => {
  try {
    const [movies] = await db.execute(
      "SELECT id, title, genre, release_year FROM movies"
    );

    res.status(200).json(movies);

  } catch (error) {
    console.error("MYSQL ERROR:", error);

    res.status(500).json({
      error: "Kunde inte hämta filmer"
    });
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`)
})