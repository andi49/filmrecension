import Link from "next/link";

export default function Here()
{
    return(
         <section className="hero">
      <div className="hero__content">
        <span className="hero__label">DIN FILMVÄRLD BÖRJAR HÄR</span>

        <h1 className="hero__title">
          Upptäck din nästa
          <span> favoritfilm.</span>
        </h1>

        <p className="hero__description">
          Utforska filmer, upptäck nya favoriter och dela
          dina recensioner med andra filmälskare.
        </p>

        <Link href="/movies" className="hero__button">
          Utforska filmer
        </Link>
      </div>
    </section>
    )
}