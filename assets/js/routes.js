import {
  getMovieByTitle,
  getMovieByGenre,
  renderMovieById,
  renderLastSearch,
} from "./movie.js";
import { genresMap } from "./genres.js";
export const router = new Navigo("/", true);

const $main = document.querySelector("#root");

const history = window.history;

export function initRouter() {
  let { href: currentURL, origin: host } = window.location;
  console.log("currentURL", currentURL);
  console.log("host", host);

  let currentPath = currentURL.replace(host, "");
  console.log("currentPath", currentPath);

  router.on("/", () => {
    $main.innerHTML = renderLastSearch();
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
          })
          .catch((err) => {
            console.log("No se pudo cargar la ruta");
          });
      }
    }
  });
  // Ruta: listar peliculas por genero - id
  router.on("/genre/:genre", ({ data }) => {
    console.log(data);
    if (!data) {
      $main.textContent = "";
      $main.innerHTML = '<h2 style="margin-top: 100px">Sin resultados<h2>';
      return;
    }
    getMovieByGenre("en", data.genre).then((section) => {
      $main.textContent = "";
      $main.appendChild(section);
    });
    // console.log(genresMap);
    console.log(data.genre);
    // history.pushState(null, null, `${currentURL}/${genresMap[data.genre]}`);
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
}
