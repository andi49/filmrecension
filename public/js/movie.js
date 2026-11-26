// Visar filminformation och hanterar recensioner samt watchlist på filmsidan.
// Hämta filmens ID från URL
const params = new URLSearchParams(window.location.search);
const movieId = Number(params.get("id"));

const token = localStorage.getItem("token");
const message = document.getElementById("message");
const reviewForm = document.getElementById("reviewForm");
const submitButton = reviewForm.querySelector("button[type='submit']") ||
  reviewForm.querySelector("button");

const addWatchlistBtn = document.getElementById("addWatchlistBtn");  

let editingReviewId = null;

// Hämta inloggad användares ID från JWT
function getUserId() {
  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    return Number(payload.id ?? payload.userId);
  } catch {
    return null;
  }
}

const currentUserId = getUserId();

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
      user.textContent = review.reviewer || "Användare";

      const rating = document.createElement("span");
      rating.className = "review-rating";
      rating.textContent = `★ ${review.rating}/10`;

      const comment = document.createElement("p");
      comment.textContent = review.comment;

      header.append(user, rating);
      card.append(header, comment);

      // Visa redigeringsknapp endast för ägaren
      if (token && currentUserId === Number(review.user_id)) {
        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "Redigera recension";
        editButton.className = "edit-button";

        editButton.addEventListener("click", () => {
          editReview(review);
        });

        card.appendChild(editButton);
      }

      reviewsList.appendChild(card);
    });

  } catch (error) {
    reviewsList.textContent = error.message;
  }
}

// Fyll formuläret med den befintliga recensionen
function editReview(review) {
  editingReviewId = review.id;

  document.getElementById("rating").value = review.rating;
  document.getElementById("comment").value = review.comment;

  submitButton.textContent = "Spara ändringar";
  message.textContent = "Du redigerar nu din recension.";

  reviewForm.scrollIntoView({ behavior: "smooth" });
}

// Avbryt redigering
const cancelButton = document.createElement("button");
cancelButton.type = "button";
cancelButton.textContent = "Avbryt redigering";
cancelButton.hidden = true;

reviewForm.appendChild(cancelButton);

cancelButton.addEventListener("click", () => {
  resetReviewForm();
  message.textContent = "";
});

function resetReviewForm() {
  editingReviewId = null;
  reviewForm.reset();
  submitButton.textContent = "Publicera recension";
  cancelButton.hidden = true;
}

// Publicera eller uppdatera en recension
reviewForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const rating = Number(document.getElementById("rating").value);
  const comment = document.getElementById("comment").value.trim();

  const isEditing = editingReviewId !== null;

  const url = isEditing
    ? `/api/reviews/${editingReviewId}`
    : `/api/movies/${movieId}/reviews`;

  try {
    const response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ rating, comment })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Kunde inte spara recensionen");
    }

    message.textContent = isEditing
      ? "Din recension har uppdaterats!"
      : "Din recension har publicerats!";

    resetReviewForm();

    await loadReviews();

  } catch (error) {
    message.textContent = error.message;
  }
});

// Visa avbryt-knappen vid redigering
function showCancelButton() {
  cancelButton.hidden = editingReviewId === null;
}

reviewForm.addEventListener("focusin", showCancelButton);


// Kontrollera om filmen finns i användarens watchlist
async function loadWatchlistStatus() {
  if (!token) {
    return;
  }

  try {
    const response = await fetch("/api/watchlist", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Kunde inte hämta watchlist");
    }

    const movies = await response.json();

    isInWatchlist = movies.some(
      (movie) => Number(movie.id) === movieId
    );

    updateWatchlistButton();

    addWatchlistBtn.hidden = false;

  } catch (error) {
    message.textContent = error.message;
  }
}


function updateWatchlistButton() {
  addWatchlistBtn.textContent = isInWatchlist
    ? "− Ta bort från min lista"
    : "+ Lägg till i min lista";
}


async function addToWatchlist() {
  const response = await fetch("/api/watchlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ movieId })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kunde inte spara filmen");
  }

  isInWatchlist = true;
  message.textContent = "Filmen har lagts till i din lista!";
}

// Ta bort filmen från watchlist
async function removeFromWatchlist() {
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

  isInWatchlist = false;
  message.textContent = "Filmen har tagits bort från din lista!";
}

// Hantera klick på watchlist-knappen
addWatchlistBtn.addEventListener("click", async () => {
  addWatchlistBtn.disabled = true;

  try {
    if (isInWatchlist) {
      await removeFromWatchlist();
    } else {
      await addToWatchlist();
    }

    updateWatchlistButton();

  } catch (error) {
    message.textContent = error.message;

  } finally {
    addWatchlistBtn.disabled = false;
  }
});

// Starta filmsidan
// Starta filmsidan
async function startMoviePage() {
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
  await loadWatchlistStatus();
}

startMoviePage();