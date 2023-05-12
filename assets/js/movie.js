import { options } from "./options.js";
import { router } from "./routes.js";
import { saveMovies } from "./bd.js";

export const searchMovie = (event) => {
  event.preventDefault();
  const search = event.target.search.value;

  router.navigate(`/find?q=${search}`);
};

// TODO: Cargar información completa de la película --> Pagina entera
// Función que busca la pelicula a partir de su titl
export const getMovieByTitle = async (title = "", lang = "en") => {
  const url = `https://streaming-availability.p.rapidapi.com/v2/search/title?title=${title}&country=us&show_type=movie&output_language=${lang}`;

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!result) {
      console.log("No encontrado");
      return;
    }
    saveMovies(result.result, "movies");
    return renderMovies(result.result);
  } catch (error) {
    throw new Error("No se pudo encontrar la pelicula especificada");
  }
};

const renderMovies = (movies) => {
  const fragment = document.createDocumentFragment();

  const $sectionMovies = document.createElement("div");
  $sectionMovies.classList.add("container-movies");

  const $template = document.querySelector("#template-producto");

  for (const movie of movies) {
    // INFORMACIÓN DE CADA PELICULA PARA EL HOVER
    const { title, year, runtime, overview, cast } = movie;

    // STRING DE LOS ACTORES:  NOMBRE1, NOMBRE2, NOMBRE A LA N AL CCUADRADO
    const castActors = cast.join(", ");

    const divInfo = document.createElement("div");

    divInfo.innerHTML = `
                  <h3>${title}</h3>
    
    `;

    const $clonArticle = $template.content.cloneNode(true);

    $clonArticle.querySelector("img").src = movie.posterURLs.original;

    // $clonArticle.querySelector(".producto-nombre").textContent = movie.title;

    // $clonArticle.querySelector(".producto-descripcion").textContent =
    //   movie.overview;

    // $clonArticle.querySelector(".producto-precio").textContent =
    //   "$ " + producto.price;

    fragment.appendChild($clonArticle);
  }

  $sectionMovies.appendChild(fragment);

  return $sectionMovies;
};

// Función para obtener peliculas por el id de genero
export const getMovieByGenre = async (lang, genreId) => {
  const urlByGenre = `https://streaming-availability.p.rapidapi.com/v2/search/basic?country=us&services=netflix%2Cprime.buy%2Chulu.addon.hbo%2Cpeacock.free&output_language=${lang}&show_type=movie&genre=${genreId}`;
  try {
    const response = await fetch(urlByGenre, options);
    const result = await response.json();
    console.log(result);
    return renderMovies(result.result);
  } catch (error) {
    throw new Error("Error en la elección de categorias");
  }
};
