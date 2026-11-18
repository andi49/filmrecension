type GenreFilterProps = {
    genres: string[]
    selectedGenre: string
    onChange: (genre:string) => void
}

export default  function  GenreFilter({
    genres,
  selectedGenre,
  onChange,

}: GenreFilterProps) {
    return (
    <div className="genre-filter">
      <label htmlFor="genre-select" className="genre-filter__label">
        Filtrera efter genre
      </label>

      <select
        id="genre-select"
        className="genre-filter__select"
        value={selectedGenre}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Alla genrer</option>

        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}