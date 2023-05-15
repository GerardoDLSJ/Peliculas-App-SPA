import {
  getMovieByTitle,
  getMovieByGenre,
  renderMovieById,
  renderLastSearch,
} from "./movie.js";
import { genresMap, selectRandomMovies } from "./genres.js";
import { addListeners } from "./main.js";
export const router = new Navigo("/", true);

const $main = document.querySelector("#root");
const history = window.history;
const $title = document.querySelector("#search-result");
export function initRouter() {
  $('[data-bs-toggle="popover"]').popover("destroy");
  let { href: currentURL, origin: host } = window.location;

  let currentPath = currentURL.replace(host, "");

  router.on("/", () => {
    $main.innerHTML = renderLastSearch();
    notReload();
  });

  // Carga peliculas aleatorias
  router.on("/index.html", () => {
    selectRandomMovies().then((result) => {
      $main.appendChild(result);
      $('[data-bs-toggle="popover"]').popover();
      notReload();
    });
  });

  // Primera ruta search
  router.on("/search", ({ data, params, queryString }) => {
    if (params) {
      if (params.q) {
        let search = params.q;
        getMovieByTitle(search, "en")
          .then((section) => {
            $main.textContent = "";
            $main.appendChild(section);
            $('[data-bs-toggle="popover"]').popover();
            notReload();
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
      notReload();
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
    if (document.querySelector(".popover")) {
      document.querySelector(".popover").remove();
    }
    $title.textContent = "";
  });

  router.notFound(() => {
    document.querySelector("main").innerHTML =
      '<h2 style="margin-top: 100px">Page not found<h2>';
  });

  router.resolve(currentPath);
  //$('[data-bs-toggle="popover"]').popover("destroy")

  $('[data-bs-toggle="popover"]').popover();
  // router.navigate(currentPath);
}
// Evitar que se recargue;
function notReload() {
  console.log("hola");
  const anchors = document.querySelectorAll(".container-movies a");
  for (var i = 0; i < anchors.length; i++) {
    var anchor = anchors[i];
    if (anchor.hasAttribute("href")) {
      anchor.addEventListener("click", function (event) {
        event.preventDefault();
        // $('[data-bs-toggle="popover"]').popover("destroy");
        let { origin: host } = window.location;
        let currentPath = this.href.replace(host, "");
        router.navigate(currentPath);
      });
    }
  }
}
