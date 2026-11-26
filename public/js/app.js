// Styr startsidans navigation, autentisering, filmer och watchlist.
const moviesSection = document.getElementById("moviesSection");
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const watchlistSection = document.getElementById("watchlistSection");

const message = document.getElementById("message");

const sections = [
  moviesSection,
  loginSection,
  registerSection,
  watchlistSection
];

// Visa en sektion åt gången
function showSection(section) {
  sections.forEach((item) => {
    item.hidden = item !== section;
  });

  message.textContent = "";
}

// Uppdatera knappar efter inloggning
function updateNavigation() {
  const loggedIn = Boolean(localStorage.getItem("token"));

  document.getElementById("loginBtn").hidden = loggedIn;
  document.getElementById("registerBtn").hidden = loggedIn;
  document.getElementById("logoutBtn").hidden = !loggedIn;
  document.getElementById("watchlistBtn").hidden = !loggedIn;
}

// Visa alla filmer
async function loadMovies() {
  const moviesList = document.getElementById("moviesList");

  try {
    const response = await fetch("/api/movies");

    if (!response.ok) {
      throw new Error("Kunde inte hämta filmer");
    }

    const movies = await response.json();

    moviesList.innerHTML = "";

    movies.forEach((movie) => {
      const card = document.createElement("div");
      card.className = "movie-card";

      const poster = document.createElement("div");
      poster.className = "movie-poster";
      poster.textContent = "🎬";

      const info = document.createElement("div");
      info.className = "movie-info";

      const title = document.createElement("h3");
      title.textContent = movie.title;

      const details = document.createElement("p");
      details.textContent = `${movie.genre} • ${movie.release_year}`;

      const movieButton = document.createElement("button");
      movieButton.className = "btn-primary";
      movieButton.textContent = "Visa film";

      movieButton.addEventListener("click", () => {
        window.location.href = `/pages/movie.html?id=${movie.id}`;
      });

      info.append(title, details, movieButton);
      card.append(poster, info);
      moviesList.appendChild(card);
    });

  } catch (error) {
    moviesList.textContent = error.message;
  }
}

// Hämta och visa användarens sparade filmer
async function loadWatchlist() {
  const watchlistList = document.getElementById("watchlistList");
  const token = localStorage.getItem("token");

  if (!token) {
    watchlistList.textContent = "Du måste logga in.";
    return;
  }

  watchlistList.textContent = "Hämtar dina sparade filmer...";

  try {
    const response = await fetch("/api/watchlist", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Kunde inte hämta din lista");
    }

    const movies = await response.json();

    if (token !== localStorage.getItem("token")) {
      return;
    }

    watchlistList.innerHTML = "";

    if (movies.length === 0) {
      watchlistList.textContent = "Du har inga sparade filmer ännu.";
      return;
    }

    movies.forEach((movie) => {
      const card = document.createElement("div");
      card.className = "movie-card";

      const poster = document.createElement("div");
      poster.className = "movie-poster";
      poster.textContent = "🎬";

      const info = document.createElement("div");
      info.className = "movie-info";

      const title = document.createElement("h3");
      title.textContent = movie.title;

      const details = document.createElement("p");
      details.textContent = `${movie.genre} • ${movie.release_year}`;

      const movieButton = document.createElement("button");
      movieButton.className = "btn-primary";
      movieButton.textContent = "Visa film";

      movieButton.addEventListener("click", () => {
        window.location.href = `/pages/movie.html?id=${movie.id}`;
      });

      const removeButton = document.createElement("button");
      removeButton.className = "btn-outline";
      removeButton.textContent = "Ta bort";

      removeButton.addEventListener("click", async () => {
        removeButton.disabled = true;

        try {
          await removeFromWatchlist(movie.id);
        } finally {
          removeButton.disabled = false;
        }
      });

      info.append(title, details, movieButton, removeButton);
      card.append(poster, info);
      watchlistList.appendChild(card);
    });

  } catch (error) {
    if (token === localStorage.getItem("token")) {
      watchlistList.textContent = error.message;
    }
  }
}

// Ta bort en film från användarens lista
async function removeFromWatchlist(movieId) {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {
    const response = await fetch(`/api/watchlist/${movieId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Kunde inte ta bort filmen");
    }

    if (token !== localStorage.getItem("token")) {
      return;
    }

    message.textContent = "Filmen har tagits bort från din lista.";

    await loadWatchlist();

  } catch (error) {
    if (token === localStorage.getItem("token")) {
      message.textContent = error.message;
    }
  }
}

// Logga in
document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Inloggningen misslyckades");
    }

    if (!data.token) {
      throw new Error("Servern skickade ingen token");
    }

    localStorage.setItem("token", data.token);

    updateNavigation();
    showSection(moviesSection);

    message.textContent = "Du är nu inloggad!";
    document.getElementById("loginForm").reset();

  } catch (error) {
    message.textContent = error.message;
  }
});

// Registrera konto
document.getElementById("registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registreringen misslyckades");
    }

    showSection(loginSection);
    message.textContent = "Kontot är skapat! Logga in.";

    document.getElementById("registerForm").reset();

  } catch (error) {
    message.textContent = error.message;
  }
});

// Menyknappar
document.getElementById("homeBtn").addEventListener("click", () => {
  showSection(moviesSection);
});

document.getElementById("loginBtn").addEventListener("click", () => {
  showSection(loginSection);
});

document.getElementById("registerBtn").addEventListener("click", () => {
  showSection(registerSection);
});

document.getElementById("watchlistBtn").addEventListener("click", () => {
  showSection(watchlistSection);
  loadWatchlist();
});

// Logga ut
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");

  document.getElementById("watchlistList").innerHTML = "";

  updateNavigation();
  showSection(moviesSection);

  message.textContent = "Du har loggat ut.";
});

// Starta sidan
updateNavigation();
loadMovies();