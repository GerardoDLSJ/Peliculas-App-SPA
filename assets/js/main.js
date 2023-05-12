import { getGenres } from "./genres.js";
import { getMovieByGenre, getMovieByTitle, searchMovie } from "./movie.js";
import { initRouter } from "./routes.js";
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
