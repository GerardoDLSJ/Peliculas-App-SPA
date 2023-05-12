import { options } from "./options.js";

const urlGenres = "https://streaming-availability.p.rapidapi.com/v2/genres";

export let genresMap = {
  1: "Biography",
  2: "Film Noir",
  3: "Game Show",
  4: "Musical",
  5: "Sport",
  6: "Short",
  7: "Adult",
  12: "Adventure",
  14: "Fantasy",
  16: "Animation",
  18: "Drama",
  27: "Horror",
  28: "Action",
  35: "Comedy",
  36: "History",
  37: "Western",
  53: "Thriller",
  80: "Crime",
  99: "Documentary",
  878: "Science Fiction",
  9648: "Mystery",
  10402: "Music",
  10749: "Romance",
  10751: "Family",
  10752: "War",
  10763: "News",
  10764: "Reality",
  10767: "Talk Show",
};

// Fetch para extraer los generos
export const getGenres = async () => {
  try {
    const response = await fetch(urlGenres, options);

    const result = await response.json();

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
