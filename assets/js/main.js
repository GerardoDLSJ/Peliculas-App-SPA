import { getGenres } from "./genres.js";
import { getMovieByGenre, getMovieByTitle, searchMovie } from "./movie.js";
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
  // Comprobar si hay peliculas en el inicio
});

function addListeners() {
  // Selecciono el elemento con el id main-search
  const $formSearch = document.getElementById("main-search");
  // Cuando detecta el submit llama a la función search movie
  $formSearch.addEventListener("submit", searchMovie);
}

// establece el tiempo de inactividad en milisegundos

// restablece el temporizador cada vez que se detecta movimiento del mouse
document.addEventListener("mousemove", () => {
  clearTimeout(temp);
  const imgMovie = document.querySelector(".full-info-resources img");
  const trailerMovie = document.querySelector(".full-info-resources iframe");
  if (!imgMovie && !trailerMovie) {
    console.log("HOla");
    return;
  }

  temp = setTimeout(() => {
    // realiza alguna acción cuando el usuario está inactivo
    console.log("HOla");

    imgMovie.classList.add("hidden");
    trailerMovie.classList.remove("hidden");
  }, timeInactive);
});
