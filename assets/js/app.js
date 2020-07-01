const listaTweets = document.getElementById("lista-tweets");
const listaTweetsBorrados = document.getElementById("lista-tweets-borrados");
const boton = document.querySelector(".button");

eventListeners();

function eventListeners() {
  //Agregar
  document
    .querySelector("#formulario")
    .addEventListener("submit", agregarTweet);

  //Borrar
  listaTweets.addEventListener("click", borrarTweet);
  listaTweetsBorrados.addEventListener("click", borrarTweet);

  //Cargar contenido del localStorage
  document.addEventListener("DOMContentLoaded", cargarLocalStorage);
}

/**
 * Agrega tweet a DOM
 * @param {*} e
 */
function agregarTweet(e) {
  //Para que no actualice pagina
  e.preventDefault();

  const datosA = obtenerTweetsLocalStorage("tweets");
  const datosB = obtenerTweetsLocalStorage("tweets-borrados");

  let existe = false;

  const dateF = new Date();
  const dateFormat =
    dateF.getDate() + "/" + (dateF.getMonth() + 1) + "/" + dateF.getFullYear();
  //cogemos el valor del textarea
  const valor = document.getElementById("tweet").value + "\n" + dateFormat;

  datosA.forEach((element) => {
    if (element === valor) {
      existe = true;
    }
  });

  datosB.forEach((element) => {
    if (element === valor) {
      existe = true;
    }
  });

  if (existe) {
    alert("Ya existe.");
    return;
  }
  document.getElementById("tweet").value = "";
  crearElemento(valor, listaTweets, "borrar-tweet", "V");

  //Añadir localStorage
  agregarTweetLocalStorage(
    valor,
    "tweets",
    obtenerTweetsLocalStorage.bind("tweets")
  );
}

function crearElemento(valor, listado, clase, letra) {
  //creamos boton eliminar
  const botonBorrar = document.createElement("a");
  botonBorrar.classList = clase;
  botonBorrar.innerText = letra;
  //creamos un elemento con el valor del texto y el boton de eliminar
  const li = document.createElement("li");
  const fecha = new Date();
  li.textContent = valor;
  li.appendChild(botonBorrar);

  //Lo agregamos a la lista
  listado.appendChild(li);
}

/**
 * Eliminar tweet
 * @param {*} e
 */
function borrarTweet(e) {
  e.preventDefault();
  if (e.target.classList.contains("borrar-tweet")) {
    const elementoBorrado = e.target.parentElement.textContent.substring(
      0,
      e.target.parentElement.textContent.length - 1
    );
    e.target.parentElement.remove();

    //Para meterlo en cosas hechas
    borrarTweetLocalStorage(e.target.parentElement.textContent);
    crearElemento(
      elementoBorrado,
      listaTweetsBorrados,
      "borrar-tweet-borrado",
      "X"
    );
    agregarTweetLocalStorage(
      elementoBorrado,
      "tweets-borrados",
      obtenerTweetsLocalStorage.bind("tweets-borrados")
    );
  } else if (e.target.classList.contains("borrar-tweet-borrado")) {
    e.target.parentElement.remove();
    borrarTweetLocalStorage(e.target.parentElement.textContent);
  }
}

function borrarTweetLocalStorage(tweet) {
  let tweetBorrar;
  tweetBorrar = tweet.substring(0, tweet.length - 1);

  tweetsA = obtenerTweetsLocalStorage("tweets");
  tweetsB = obtenerTweetsLocalStorage("tweets-borrados");

  tweetsA.forEach((element, index) => {
    if (element === tweetBorrar) {
      tweetsA.splice(index, 1);
    }
  });

  tweetsB.forEach((element, index) => {
    if (element === tweetBorrar) {
      tweetsB.splice(index, 1);
    }
  });
  localStorage.setItem("tweets", JSON.stringify(tweetsA));
  localStorage.setItem("tweets-borrados", JSON.stringify(tweetsB));
}

/**
 * Agrega tweet a localStorage
 * @param {*} valor
 */
function agregarTweetLocalStorage(valor, nombre, metodo) {
  let tweets = metodo(nombre);

  tweets.push(valor);
  localStorage.setItem(nombre, JSON.stringify(tweets));
}

/**
 * Comprobar que hay elementos en localStorage
 */
function obtenerTweetsLocalStorage(nombre) {
  let tweets;

  if (localStorage.getItem(nombre) === null) {
    tweets = [];
  } else {
    tweets = JSON.parse(localStorage.getItem(nombre));
  }
  return tweets;
}

/**
 * Mostrar datos localStorage
 */

function cargarLocalStorage() {
  let tweets;
  tweets = obtenerTweetsLocalStorage("tweets");
  tweetsBorrados = obtenerTweetsLocalStorage("tweets-borrados");
  tweets.forEach((element) => {
    crearElemento(element, listaTweets, "borrar-tweet", "V");
  });
  tweetsBorrados.forEach((element) => {
    crearElemento(element, listaTweetsBorrados, "borrar-tweet-borrado", "X");
  });
}
