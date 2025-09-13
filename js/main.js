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

async function main() {
    const moviesData = await getData(MOVIES_DATA_URL);
    console.log(moviesData);
}

document.addEventListener("DOMContentLoaded", main);