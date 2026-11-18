import { Suspense } from "react";
import MovieDetails from "@/components/MovieDetails";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default function MoviePage({ params }: MoviePageProps) {
  return (
    <main>
      <Suspense fallback={<p>Laddar filmsidan...</p>}>
        <MoviePageContent params={params} />
      </Suspense>
    </main>
  );
}

async function MoviePageContent({ params }: MoviePageProps) {
  const { id } = await params;

  return <MovieDetails movieId={id} />;
}
