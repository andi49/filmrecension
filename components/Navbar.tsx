import Link from "next/link";

export default function Navbar() {
    return(
        <header className="navbar">
            <nav className="navbar__container">
            <Link href="/" className="navbar__logo">
            <span className="navbar__logo-icon">🎬</span>
            FilmRecension
            </Link>
            <div className="navbar__links">
          <Link href="/">Hem</Link>
          <Link href="/movies">Filmer</Link>
          <Link href="/top-rated">Topplistan</Link>
        </div>

        <div className="navbar__actions">
          <Link href="/login" className="navbar__login">
            Logga in
          </Link>

          <Link href="/register" className="navbar__register">
            Registrera dig
          </Link>
        </div>
            </nav>
        </header>
    )
}