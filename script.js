const backgroundNav = document.querySelector(".background-nav");
const favoriteNav = document.querySelector(".favorite-nav");
const contentContainer = document.querySelector(".container");
const loader = document.querySelector(".loader");
const saveConfirmed = document.querySelector(".save-confirmed");

let resultsArray = [];
let favorites = {};

const count = 5;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  loader.classList.add("hidden");
  if (page === "results") {
    backgroundNav.classList.hidden = false;
    favoriteNav.classList.hidden = true;
  } else {
    backgroundNav.classList.hidden = true;
    favoriteNav.classList.hidden = false;
  }
}

// Add result to Favorites
function saveFavorite(itemUrl) {
  // Loop through Results Array to select Favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // Show Save Confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set Favorites in localStorage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

function displayContent(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // Content
    const content = document.createElement("div");
    content.classList.add("content");
    // Link
    const imageLink = document.createElement("a");
    imageLink.href = result.url;
    imageLink.title = result.title;
    imageLink.target = "_blank";
    // Image
    const image = document.createElement("img");
    image.src = result.url;
    // text Container
    const textContainer = document.createElement("div");
    textContainer.classList.add("text-container");
    // Title
    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = result.title;
    // Favorite Button
    const addFavorites = document.createElement("p");
    addFavorites.classList.add("clickable", "addFavorites");
    if (page === "results") {
      addFavorites.setAttribute("onclick", `saveFavorite('${result.url}')`);
      addFavorites.textContent = "Add to Favorites";
    } else {
      addFavorites.setAttribute("onclick", `removeFavorite('${result.url}')`);
      addFavorites.textContent = "Remove from Favorites";
    }
    // Text
    const text = document.createElement("p");
    text.classList.add("text");
    text.textContent = result.explanation;
    // Footer
    const footer = document.createElement("div");
    footer.classList.add("footer-container");
    // Date
    const date = document.createElement("small");
    date.classList.add("date");
    date.textContent = result.date;
    // Author
    const author = document.createElement("small");
    author.classList.add("author");
    author.textContent = result.copyright;
    // Append
    footer.append(date, author);
    textContainer.append(title, addFavorites, text);
    imageLink.appendChild(image);
    content.append(imageLink, textContainer, footer);
    contentContainer.appendChild(content);
  });
}

function updateDOM(page) {
  // Get Favorites from localStorage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  // Reset DOM, Create DOM Nodes, Show Content
  contentContainer.textContent = "";
  displayContent(page);
  showContent(page);
}

async function getNasaPictures() {
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    console.log(resultsArray);
    updateDOM("results");
  } catch (error) {
    console.log("error");
  }
}

getNasaPictures();
