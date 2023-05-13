import { options } from "./options.js";
import { router } from "./routes.js";
import { getFromBD, saveMovies } from "./bd.js";
import { genresMap } from "./genres.js";

const platformsLink = {
  netflix: ["https://www.netflix.com/", "#E50910"],
  hbo: ["https://www.hbomax.com/", "#6730A7"],
  hulu: ["https://www.hulu.com/", "#31B242"],
  prime: ["https://www.primevideo.com/", "#1158BF"],
  disney: ["https://www.disneyplus.com/", "#3779D8"],
  apple: ["https://tv.apple.com/", "#969C96"],
  peacock: ["https://www.peacocktv.com/", "#e6e600"],
  paramount: ["https://www.paramountplus.com/", "#1d6ff2"],
  undefined: ["https://www.google.com", "#57322"],
};

export const searchMovie = (event) => {
  event.preventDefault();
  const search = event.target.search.value;
  document.title = search;

  router.navigate(`/find?q=${search}`);
};

// TODO: Cargar información completa de la película --> Pagina entera
// Función que busca la pelicula a partir de su titulo o otra palabra clave
export const getMovieByTitle = async (title = "", lang = "en") => {
  const url = `https://streaming-availability.p.rapidapi.com/v2/search/title?title=${title}&country=us&show_type=movie&output_language=${lang}`;
  document.title = title;
  updateSearchTitle(`Search Results: ${title}`);
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

const updateSearchTitle = (title) => {
  const $titleSearch = document.querySelector("#search-result");
  $titleSearch.textContent = title;
};

const renderMovies = (movies = []) => {
  const fragment = document.createDocumentFragment();
  console.log(movies);
  const $sectionMovies = document.createElement("div");
  $sectionMovies.classList.add("container-movies");

  const $template = document.querySelector("#template-producto");

  movies.forEach((movie, index) => {
    const link = document.createElement("a");

    link.setAttribute("href", `/movie/${index + 1}`);

    // INFORMACIÓN DE CADA PELICULA PARA EL HOVER
    const { title, year, runtime, overview, cast } = movie;

    // STRING DE LOS ACTORES:  NOMBRE1, NOMBRE2, NOMBRE A LA N AL CCUADRADO
    const castActors = cast.join(", ");

    const divInfo = document.createElement("div");

    divInfo.innerHTML = `
                  <h3>${title}</h3>
    
    `;

    const $clonArticle = $template.content.cloneNode(true);

    $clonArticle.querySelector("img").src =
      movie.posterURLs[342] ?? "/assets/img/icon-image-not-found-vector.webp";

    // $clonArticle.querySelector(".producto-nombre").textContent = movie.title;

    // $clonArticle.querySelector(".producto-descripcion").textContent =
    //   movie.overview;

    // $clonArticle.querySelector(".producto-precio").textContent =
    //   "$ " + producto.price;
    link.appendChild($clonArticle);

    fragment.appendChild(link);
  });

  $sectionMovies.appendChild(fragment);

  return $sectionMovies;
};

export const renderMovieById = (id) => {
  const movies = getFromBD("movies");
  console.log(movies);

  const movie = movies[id - 1];
  const {
    title,
    imdbRating,
    year,
    runtime,
    genres,
    overview,
    streamingInfo,
    youtubeTrailerVideoId,
    youtubeTrailerVideoLink,
    backdropURLs,
  } = movie;
  document.title = title;
  const genresList = genres
    .map((genre, index) => {
      return genre.name;
    })
    .join(" ");

  return `
    <section class="container-movie-fullinfo">
      <div class="fullinfo-data">
          <h2>${title}</h2>
          <p class="imdb-raiting">Imdb <span>${imdbRating}</span></p>
          <a class="btn-trailer" href="${youtubeTrailerVideoLink}" target="_blank">
          <i class="bi bi-play"></i>
          <p>
            Trailer
          </p>
          </a>
          <div class='fullinfo-details'>
            <div class='details-datetime'>
                <p>${year}</p>
                <p>${runtime} min</p>
              </div>
              <div class='details-genres'>
                <span>${genresList}</span>
              </div>
            </div>
          <p class='overview'>${overview}</p>
          <h3>Disponible en:</h3>
          <div class='container-platforms'>
            ${streamingPlatforms(streamingInfo.us).innerHTML}
          </div>
      </div>
      <div class="full-info-resources">
        <div>
          <img src="${
            backdropURLs.original ??
            "/assets/img/icon-image-not-found-vector.webp"
          }" />
          <iframe class="hidden" width="560" height="315"  src="https://www.youtube.com/embed/${youtubeTrailerVideoId}?autoplay=1&mute=1&loop=1" frameborder="0" allowfullscreen></iframe>

        </div>
      </div>
    </section>
  
  `;
};

const streamingPlatforms = (streamingInfo = []) => {
  const div = document.createElement("div");
  const a = Object.keys(streamingInfo);
  console.log(a);
  console.log(streamingInfo);
  Object.keys(streamingInfo).forEach((value) => {
    console.log(value);
    const link = document.createElement("a");
    link.textContent = value;
    const platformInfo = getUrlPlatform(value);
    console.log(platformInfo);
    link.href = platformInfo[0];
    link.target = "_blank";
    link.style.backgroundColor = platformInfo[1];
    div.appendChild(link);
  });
  return div;
};

const getUrlPlatform = (key) => {
  console.log(key);

  const valores = platformsLink[key];
  console.log(valores);
  return valores;
};

// Función para obtener peliculas por el id de genero
export const getMovieByGenre = async (lang, genreId) => {
  const urlByGenre = `https://streaming-availability.p.rapidapi.com/v2/search/basic?country=us&services=netflix%2Cprime.buy%2Chulu.addon.hbo%2Cpeacock.free&output_language=${lang}&show_type=movie&genre=${genreId}`;
  try {
    const response = await fetch(urlByGenre, options);
    const result = await response.json();
    saveMovies(result.result, "movies");
    document.title = genresMap[genreId];
    updateSearchTitle(`Genre: ${genresMap[genreId]}`);
    return renderMovies(result.result);
  } catch (error) {
    throw new Error("Error en la elección de categorias");
  }
};

export function renderLastSearch() {
  const lastSearch = getFromBD("movies");

  if (!lastSearch) {
    return `<h1>You have not performed a search yet</h1>`;
  }
  return `
          <h1>Last Results:</h1>
          <div class="container-movies">
                ${renderMovies(lastSearch).innerHTML}
          </div>`;
}
