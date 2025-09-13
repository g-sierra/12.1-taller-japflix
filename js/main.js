// DOM variables
const searchInput = document.getElementById("inputBuscar");
const moviesContainer = document.getElementById("lista");

// api url
const MOVIES_DATA_URL = "https://japceibal.github.io/japflix_api/movies-data.json";

async function getData(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        return await res.json();
    } catch(e) {
        console.error("Error al cargar los datos:", e);
    }
}

function renderStars(rating) {
    const maxStars = 5;
    const starRating = rating / 2;
    let html = "";

    for (let i = 1; i <= maxStars; i++) {
        if (i <= Math.floor(starRating)) {
            html += '<i class="bi bi-star-fill checked"></i>';
        } else if (i - starRating <= 0.5) {
            html += '<i class="bi bi-star-half checked"></i>';
        } else {
            html += '<i class="bi bi-star checked"></i>';
        }
    }
    return html;
}

function renderMovies(moviesArr) {
    moviesContainer.innerHTML = "";
    moviesArr.forEach(movie => {
        const li = document.createElement("li");
        li.classList.add(
            "list-group-item",
            "bg-dark",
            "text-white",
            "d-flex",
            "justify-content-between",
            "align-items-center",
            "border-black",
            "cursor-pointer"
        );
        li.innerHTML = `
        <div class="movie-info">
            <h5 class="movie-title fw-bold mt-2">${movie.title}</h5>
            <p class="movie-tagline text-muted fst-italic">${movie.tagline}</p>
        </div>
        <div class="movie-rating">
            ${renderStars(movie.vote_average)}
        </div>
        `;
        moviesContainer.appendChild(li);
    });
}

async function main() {
    const moviesData = await getData(MOVIES_DATA_URL);
    console.log(moviesData);
    renderMovies(moviesData);
}

document.addEventListener("DOMContentLoaded", main);
