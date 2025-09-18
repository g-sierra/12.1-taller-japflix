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

// Funcion para obtener los datos de la API
async function getData(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        return await res.json();
    } catch (e) {
        console.error("Error al cargar los datos:", e);
        displayMessage("Ocurrió un error al cargar los datos. Por favor, intente nuevamente más tarde.");
    }
}

// Funcion para mostrar mensajes en el contenedor de peliculas
function displayMessage(text) {
    moviesContainer.innerHTML = "";
    const p = document.createElement("p");
    p.classList.add("fs-4", "text-muted", "text-center");
    p.textContent = text;
    moviesContainer.appendChild(p);
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

// Crea elementos li con la info de las peliculas
function createListItem(movieObj) {
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

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("movie-info");

    const link = document.createElement("a");
    link.classList.add("text-white", "movie-link");
    link.setAttribute("data-bs-toggle", "offcanvas");
    link.setAttribute("href", "#movieInfoOffcanvas");
    link.setAttribute("aria-controls", "movieInfoOffcanvas");
    link.setAttribute("data-movie-id", movieObj.id);

    const title = document.createElement("h5");
    const movieYear = getYear(movieObj);
    title.classList.add("movie-title", "fw-bold", "mt-2");
    title.textContent = `${movieObj.title} (${movieYear})`;

    link.appendChild(title);

    const tagline = document.createElement("p");
    tagline.classList.add("movie-tagline", "text-muted", "fst-italic");
    tagline.textContent = movieObj.tagline;

    infoDiv.appendChild(link);
    infoDiv.appendChild(tagline);

    const ratingDiv = document.createElement("div");
    ratingDiv.classList.add("movie-rating");
    ratingDiv.setAttribute("title", `Rating: ${movieObj.vote_average}/10`);
    ratingDiv.innerHTML = renderStars(movieObj.vote_average);

    li.appendChild(infoDiv);
    li.appendChild(ratingDiv);

    return li;
}

// Inserta los li en el contenedor de peliculas
function renderMovies(moviesArr) {
    moviesContainer.innerHTML = "";
    if (moviesArr.length === 0) {
        displayMessage("No se encontraron películas que coincidan con la búsqueda.");
        return;
    }
    moviesArr.forEach(movie => {
        const li = createListItem(movie);
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
    const year = getYear(movieObj);
    const runtime = `${movieObj.runtime} mins`;
    const budget = `$${movieObj.budget.toLocaleString()}`;
    const revenue = `$${movieObj.revenue.toLocaleString()}`;
    movieYearOffcanvas.innerHTML = labelText("Year", year);
    movieRuntimeOffcanvas.innerHTML = labelText("Runtime", runtime);
    movieBudgetOffcanvas.innerHTML = labelText("Budget", budget);
    movieRevenueOffcanvas.innerHTML = labelText("Revenue", revenue);
}

// Funcion para obtener el año de una pelicula
function getYear(movieObj) {
    return movieObj.release_date.split("-")[0];
}

// Funcion para los textos con label del offcanvas
function labelText(label, value) {
    return `<span>${label}: </span><span>${value}</span>`;
}

// Proceso principal
async function main() {
    // Carga los datos
    const moviesData = await getData(MOVIES_DATA_URL);
    if (!moviesData) return;

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

    // Delegación de eventos para abrir el offcanvas al hacer click en el titulo de la pelicula
    moviesContainer.addEventListener("click", e => {
        const link = e.target.closest(".movie-link");
        if (!link) return;

        const movieId = link.getAttribute("data-movie-id");
        const movieObj = moviesData.find(movie => movie.id === parseInt(movieId));
        if (!movieObj) return;

        updateOffcanvas(movieObj);
    });
}

// Ejecutar el proceso principal al cargar la pagina
document.addEventListener("DOMContentLoaded", main);
