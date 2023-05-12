import { getMovieByTitle } from "./movie.js";

export const router = new Navigo("/", true);

const $main = document.querySelector("#root");

export function initRouter() {
  let { href: currentURL, origin: host } = window.location;
  console.log("currentURL", currentURL);
  console.log("host", host);

  let currentPath = currentURL.replace(host, "");
  console.log("currentPath", currentPath);

  router.on("/", () => {
    document.querySelector("main").innerHTML =
      '<h2 style="margin-top: 100px">Inicio<h2>';
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

  router.notFound(() => {
    document.querySelector("main").innerHTML =
      '<h2 style="margin-top: 100px">Page not found<h2>';
  });

  router.resolve(currentPath);
}
