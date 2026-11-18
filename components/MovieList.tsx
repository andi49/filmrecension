
"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import SearchBar from "./SearchBar";
import GenreFilter from "./GenreFilter";

type MovieListProps = {
  limit?: number;
  showSearch?: boolean;
};

type Movie = {
  id: number;
  title: string;
  description: string | null;
  genre: string | null;
  release_year: number | null;
};

export default function MovieList({
  limit,
  showSearch = false,
}: MovieListProps) {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("/api/movies");

        if (!response.ok) {
          throw new Error("Kunde inte hämta filmer");
        }

        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error(error);
        setError("Det gick inte att hämta filmerna.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  // GET ALL MOVIES 
  const genres = [
    ...new Set(
      movies
        .map((movie) => movie.genre)
        .filter((genre): genre is string => Boolean(genre))
    ),
  ];

  //FILTER
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const matchesGenre =
      selectedGenre === "" || movie.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  // ONLY SHOW 6 LANDINGPAGE
  const visibleMovies =
    limit !== undefined
      ? filteredMovies.slice(0, limit)
      : filteredMovies;

  if (loading) return <p>Laddar filmer...</p>;

  if (error) return <p role="alert">{error}</p>;

  if (movies.length === 0) {
    return <p>Inga filmer hittades.</p>;
  }

  return (
    <section className="movie-list">
      <div className="movie-list__header">
        <h2>Utforska filmer</h2>
        <p>Hitta din nästa favorit bland våra filmer.</p>
      </div>

      {showSearch && (
        <div className="movie-list__filters">
          <SearchBar value={search} onChange={setSearch} />

          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onChange={setSelectedGenre}
          />
        </div>
      )}

      {visibleMovies.length === 0 && (
        <p>Inga filmer matchar din sökning.</p>
      )}

      <div className="movie-list__grid">
        {visibleMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
