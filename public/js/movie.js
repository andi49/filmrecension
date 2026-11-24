
// Hämta filmens ID från URL
const params = new URLSearchParams(window.location.search);
const movieId = Number(params.get("id"));

const token = localStorage.getItem("token");
const message = document.getElementById("message");
const reviewForm = document.getElementById("reviewForm");

// Hämta filmens information
async function loadMovie() {
  try {
    const response = await fetch(`/api/movies/${movieId}`);

    if (!response.ok) {
      throw new Error("Kunde inte hämta filmen");
    }

    const movie = await response.json();

    document.getElementById("movieTitle").textContent = movie.title;
    document.getElementById("movieGenre").textContent = `Genre: ${movie.genre}`;
    document.getElementById("movieYear").textContent = `År: ${movie.release_year}`;

    document.title = `${movie.title} | FilmRecension`;

    return true;

  } catch (error) {
    message.textContent = error.message;
    return false;
  }
}

// Hämta filmens recensioner
async function loadReviews() {
  const reviewsList = document.getElementById("reviewsList");

  try {
    const response = await fetch(`/api/movies/${movieId}/reviews`);

    if (!response.ok) {
      throw new Error("Kunde inte hämta recensioner");
    }

    const reviews = await response.json();

    reviewsList.innerHTML = "";

    if (reviews.length === 0) {
      reviewsList.textContent = "Det finns inga recensioner ännu.";
      return;
    }

    reviews.forEach((review) => {
      const card = document.createElement("div");
      card.className = "review-card";

      const header = document.createElement("div");
      header.className = "review-header";

      const user = document.createElement("strong");
      user.textContent = review.username || "Användare";

      const rating = document.createElement("span");
      rating.className = "review-rating";
      rating.textContent = `★ ${review.rating}/10`;

      const comment = document.createElement("p");
      comment.textContent = review.comment;

      header.append(user, rating);
      card.append(header, comment);

      reviewsList.appendChild(card);
    });

  } catch (error) {
    reviewsList.textContent = error.message;
  }
}

// Publicera en recension
reviewForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const rating = Number(document.getElementById("rating").value);
  const comment = document.getElementById("comment").value.trim();

  try {
    const response = await fetch(`/api/movies/${movieId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ rating, comment })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Kunde inte publicera recensionen");
    }

    message.textContent = "Din recension har publicerats!";
    reviewForm.reset();

    await loadReviews();

  } catch (error) {
    message.textContent = error.message;
  }
});

// Starta filmsidan
async function init() {
  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    message.textContent = "Ogiltigt film-ID";
    return;
  }

  const movieExists = await loadMovie();

  if (!movieExists) {
    return;
  }

  document.getElementById("reviewSection").hidden = !token;
  document.getElementById("loginNotice").hidden = Boolean(token);

  await loadReviews();
}

init();
