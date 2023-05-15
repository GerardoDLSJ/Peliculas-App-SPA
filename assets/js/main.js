import { getGenres } from "./genres.js";
import { searchMovie } from "./movie.js";
import { initRouter } from "./routes.js";

const timeInactive = 2000; // 4 segundos

// establece el temporizador
let temp;

window.addEventListener("DOMContentLoaded", () => {
  // Carga los generos en el menu y los despliega con el hover
  getGenres();
  // Añade el evento para detectar un submit en la parte de la barra de busqueda (el dar enter)
  addListeners();
  //Inicio las rutas
  initRouter();
});

function addListeners() {
  // Selecciono el elemento con el id main-search
  const $formSearch = document.getElementById("main-search");
  // Cuando detecta el submit llama a la función search movie
  $formSearch.addEventListener("submit", searchMovie);
}

document.addEventListener("mousemove", () => {
  // restablece el temporizador cada vez que se detecta movimiento del mouse
  clearTimeout(temp);
  const imgMovie = document.querySelector(".full-info-resources img");
  const trailerMovie = document.querySelector(".full-info-resources iframe");
  if (!imgMovie && !trailerMovie) {
    return;
  }

  temp = setTimeout(() => {
    // realiza alguna acción cuando el usuario está inactivo
    imgMovie.classList.add("hidden");
    trailerMovie.classList.remove("hidden");
  }, timeInactive);
});
