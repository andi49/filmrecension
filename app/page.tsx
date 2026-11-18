
import Hero from "@/components/Hero";
import MovieList from "@/components/MovieList";

export default function Home() {
  return (
    <main>
      <Hero />
      <MovieList limit={6}/>
    </main>
  );
}
