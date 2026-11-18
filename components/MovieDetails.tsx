"use client";

import { useEffect, useState } from "react";

type Movie = {
  id: number;
  title: string;
  description: string | null;
  genre: string | null;
  release_year: number | null;
};

type MovieDetailsProps = {
  movieId: string;
};

export default function MovieDetails({ movieId }: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await fetch(`/api/movies/${movieId}`);

        if (!response.ok) {
          throw new Error("Kunde inte hämta filmen");
        }

        const data: Movie = await response.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
        setError("Det gick inte att ladda filmen.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [movieId]);

  if (loading) {
    return <p className="movie-details__message">Laddar film...</p>;
  }

  if (error) {
    return <p className="movie-details__message" role="alert">{error}</p>;
  }

  if (!movie) {
    return <p className="movie-details__message">Filmen hittades inte.</p>;
  }

  return (
    <section className="movie-details">
      <div className="movie-details__poster">
        <span>🎬</span>
      </div>

      <div className="movie-details__content">
        <span className="movie-details__genre">
          {movie.genre || "Okänd genre"}
        </span>

        <h1>{movie.title}</h1>

        <p className="movie-details__year">
          Utgivningsår: {movie.release_year || "Okänt"}
        </p>

        <h2>Om filmen</h2>

        <p className="movie-details__description">
          {movie.description || "Ingen beskrivning finns ännu."}
        </p>
      </div>
    </section>
  );
}
