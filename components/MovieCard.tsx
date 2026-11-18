import Link from "next/link";

type Movie = {
  id: number;
  title: string;
  description: string | null;
  genre: string | null;
  release_year: number | null;
};

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="movie-card__link">
      <article className="movie-card">
        <div className="movie-card__poster">
          <span>🎬</span>
        </div>

        <div className="movie-card__content">
          <span className="movie-card__genre">
            {movie.genre || "Okänd genre"}
          </span>

          <h3 className="movie-card__title">{movie.title}</h3>

          <p className="movie-card__year">
            {movie.release_year || "Okänt år"}
          </p>

          {movie.description && (
            <p className="movie-card__description">
              {movie.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
