// Elementos DOM
const searchInput = document.getElementById("inputBuscar");
const searchBtn = document.getElementById("btnBuscar");
const moviesContainer = document.getElementById("lista");
// Elementos DOM - Offcanvas
const movieTitleOffcanvas = document.getElementById("movieTitleOffcanvas");
const movieOverviewOffcanvas = document.getElementById("movieOverviewOffcanvas");
const movieGenresOffcanvas = document.getElementById("movieGenresOffcanvas");
const movieYearOffcanvas = document.getElementById("movieYearOffcanvas");
const movieRuntimeOffcanvas = document.getElementById("movieRuntimeOffcanvas");
const movieBudgetOffcanvas = document.getElementById("movieBudgetOffcanvas");
const movieRevenueOffcanvas = document.getElementById("movieRevenueOffcanvas");

// API URL
const MOVIES_DATA_URL = "https://japceibal.github.io/japflix_api/movies-data.json";

async function getData(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        return await res.json();
    } catch (e) {
        console.error("Error al cargar los datos:", e);
    }
}

// Transforma el rating de 0 a 10 en estrellas
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

// Inserta li con info de cada pelicula
function renderMovies(moviesArr) {
    moviesContainer.innerHTML = "";
    if (moviesArr.length === 0) {
        moviesContainer.innerHTML = `
            <p class="fs-4 text-muted text-center">
                No se encontraron películas que coincidan con la búsqueda.
            </p>
        `;
        return;
    }
    moviesArr.forEach(movie => {
        const li = document.createElement("li");
        li.classList.add(
            "list-group-item",
            "bg-dark",
            "text-white",
            "d-flex",
            "justify-content-between",
            "align-items-center",
            "border-black"
        );
        li.innerHTML = `
        <div class="movie-info">
            <a
                class="text-white movie-link"
                data-bs-toggle="offcanvas"
                href="#movieInfoOffcanvas"
                aria-controls="movieInfoOffcanvas"
            >
                <h5 class="movie-title fw-bold mt-2">${movie.title}</h5>
            </a>
            <p class="movie-tagline text-muted fst-italic">${movie.tagline}</p>
        </div>
        <div class="movie-rating" title="Rating: ${movie.vote_average}/10">
            ${renderStars(movie.vote_average)}
        </div>
        `;

        // Agrega evento para mostrar info en el offcanvas
        const link = li.querySelector(".movie-link");
        link.addEventListener("click", () => updateOffcanvas(movie));

        moviesContainer.appendChild(li);
    });
}

// Maneja la busqueda de peliculas
function getSearchedMovies(moviesArr, query) {
    const queryLower = query.toLowerCase().trim(); // Lo que busca el usuario

    // Filtra las peliculas que conciden con la query
    const results = moviesArr.filter(movie => {
        const searchTargets = [
            movie.title,
            movie.tagline,
            movie.overview,
            ...movie.genres.map(genre => genre.name),
        ];

        return searchTargets.some(target => target.toLowerCase().includes(queryLower));
    });

    return results;
}

// Muestra la info de la pelicula clickeada en el offcanvas
function updateOffcanvas(movieObj) {
    movieTitleOffcanvas.textContent = movieObj.title;
    movieOverviewOffcanvas.textContent = movieObj.overview;
    movieGenresOffcanvas.textContent = movieObj.genres.map(genre => genre.name).join(" - ");
    movieYearOffcanvas.innerHTML = `<span>Year: </span> <span>${movieObj.release_date.split("-")[0]}</span>`;
    movieRuntimeOffcanvas.innerHTML = `<span>Runtime: </span> <span>${movieObj.runtime} mins</span>`;
    movieBudgetOffcanvas.innerHTML = `<span>Budget: </span> <span>$${movieObj.budget.toLocaleString()}</span>`;
    movieRevenueOffcanvas.innerHTML = `<span>Revenue: </span> <span>$${movieObj.revenue.toLocaleString()}</span>`;
}

// Proceso principal
async function main() {
    // Carga los datos
    const moviesData = await getData(MOVIES_DATA_URL);

    // Manejo de la busqueda
    const handleSearch = () => {
        const query = searchInput.value.trim();
        if (!query) return;
        const results = getSearchedMovies(moviesData, query);
        renderMovies(results);
    };

    // Busqueda al hacer click en el boton Buscar
    searchBtn.addEventListener("click", handleSearch);

    // Busqueda al presionar Enter en el input
    searchInput.addEventListener("keydown", e => {
        if (e.key === "Enter") handleSearch();
    });
}

// Ejecutar el proceso principal al cargar la pagina
document.addEventListener("DOMContentLoaded", main);
