// TODO: Guardar las peliculas

export function saveMovies(data, key) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromBD(key) {
  const result = JSON.parse(localStorage.getItem(key));
  console.log(result);
}
