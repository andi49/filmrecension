type SearchBarProps = {
    value: string
    onChange: (value: string) => void;
}

export default function SearchBar({
    value,
    onChange,
}: SearchBarProps) {
    return (
        <div className="search-bar">
      <label htmlFor="movie-search" className="search-bar__label">
        Sök efter en film
      </label>

      <input
        id="movie-search"
        type="search"
        className="search-bar__input"
        placeholder="Sök på filmtitel..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
    )
}