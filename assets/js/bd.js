// TODO: Guardar las peliculas

export function saveMovies(data, key) {
  if (!data) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromBD(key) {
  const result = JSON.parse(localStorage.getItem(key));
  return result;
}
