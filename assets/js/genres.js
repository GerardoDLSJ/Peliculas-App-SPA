import { options } from "./options.js";

const urlGenres = "https://streaming-availability.p.rapidapi.com/v2/genres";

export let genresMap = {};

// Fetch para extraer los generos
export const getGenres = async () => {
  try {
    const response = await fetch(urlGenres, options);

    const result = await response.json();

    genresMap = result.result;
    console.log(genresMap);
    listGenres(result.result);
  } catch (error) {
    console.error(error);
  }
};

// TODO: Listar los generos en Generos
function listGenres(list) {
  var $fragment = document.createDocumentFragment();

  var $lista = document.getElementById("menu-categorias");

  Object.entries(list).forEach(([key, value]) => {
    var $li = document.createElement("li");
    $li.classList.add("main-nav__submenu-item");

    var $link = document.createElement("a");
    $link.textContent = value;
    $link.setAttribute("href", "/genre/" + key);
    $link.setAttribute("data-navigo", "");

    $li.appendChild($link);
    $fragment.appendChild($li);
  });

  $lista.appendChild($fragment);
}
