import {
  getMovieByTitle,
  getMovieByGenre,
  renderMovieById,
  renderLastSearch,
} from "./movie.js";
import { genresMap, selectRandomMovies } from "./genres.js";
export const router = new Navigo("/", true);

const $main = document.querySelector("#root");

const history = window.history;

export function initRouter() {
  $('[data-bs-toggle="popover"]').popover("destroy");
  let { href: currentURL, origin: host } = window.location;

  let currentPath = currentURL.replace(host, "");

  router.on("/", () => {
    $main.innerHTML = renderLastSearch();
  });

  // Carga peliculas aleatorias
  router.on("/index.html", () => {
    selectRandomMovies().then((result) => {
      $main.appendChild(result);
      $('[data-bs-toggle="popover"]').popover();
    });
  });

  // Primera ruta find
  router.on("/find", ({ data, params, queryString }) => {
    if (params) {
      if (params.q) {
        let search = params.q;
        getMovieByTitle(search, "en")
          .then((section) => {
            $main.textContent = "";
            $main.appendChild(section);
            $('[data-bs-toggle="popover"]').popover();
          })
          .catch((err) => {
            console.log("No se pudo cargar la ruta");
          });
      }
    }
  });
  // Ruta: listar peliculas por genero - id
  router.on("/genre/:genre", ({ data }) => {
    if (!data) {
      $main.textContent = "";
      $main.innerHTML = '<h2 style="margin-top: 100px">Sin resultados<h2>';
      return;
    }
    getMovieByGenre("en", data.genre).then((section) => {
      $main.textContent = "";
      $main.appendChild(section);
      $('[data-bs-toggle="popover"]').popover();
    });
  });

  // Ruta info imagen
  router.on("/movie/:id", ({ data }) => {
    if (!data) {
      $main.textContent = "";
      $main.innerHTML = '<h2 style="margin-top: 100px">Ocurrió un error<h2>';
      return;
    }

    $main.innerHTML = renderMovieById(data.id);
  });

  router.notFound(() => {
    document.querySelector("main").innerHTML =
      '<h2 style="margin-top: 100px">Page not found<h2>';
  });

  router.resolve(currentPath);
  //$('[data-bs-toggle="popover"]').popover("destroy")

  $('[data-bs-toggle="popover"]').popover();
}
