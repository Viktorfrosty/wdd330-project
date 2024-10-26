// Data handler module.

// API configurations.
const baseURL = "https://api.scryfall.com";
const userAgent = "TradingCardsInfoTracker/0.0.1";
const accept = "application/json";
const regex = /\{.*?\}/g;
// Fetch delay function
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Local storage functions.
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// data expiration check.
function dataExpirationCheck(key) {
  const storedTime = getLocalStorage(key);
  const timeDifference = Date.now() - storedTime;
  return storedTime && timeDifference < 86400000;
}
// Function to fetch data from API.
export async function fetchData(url) {
  await delay(100);
  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      Accept: accept,
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    window.location.href = "result.html?element=error";
  }
}
// save favorite funcion.
export function saveFavorite(card) {
  let favorites = getLocalStorage("favorites");
  if (!favorites) {
    favorites = [];
  }
  favorites.push(card);
  setLocalStorage("favorites", favorites);
}
// check if in favorite function.
export function checkFavorite(card) {
  const favorites = getLocalStorage("favorites");
  if (favorites) {
    return favorites.some((object) => card.id === object.id);
  } else {
    return false;
  }
}
// Icons retriever function.
export async function setIconRetriever(setId) {
  const setList = getLocalStorage("sets");
  let result = null;
  setList.data.forEach((set) => {
    if (setId === set.id) {
      result = `<img loading="lazy" src="${set.icon_svg_uri}" alt="${set.name} icon" width="20">`;
    }
  });
  return result;
}
// Information stored to make the loading faster.
export async function storedData() {
  const symbolsData = getLocalStorage("symbols");
  const SetsData = getLocalStorage("sets");
  if (!dataExpirationCheck("symbols-stamp") || !symbolsData) {
    const data = await fetchData(`${baseURL}/symbology`);
    setLocalStorage("symbols", data);
    setLocalStorage("symbols-stamp", Date.now());
  }
  if (!dataExpirationCheck("sets-stamp") || !SetsData) {
    const data = await fetchData(`${baseURL}/sets`);
    setLocalStorage("sets", data);
    setLocalStorage("sets-stamp", Date.now());
  }
}
// Symbols utilitarian functions.
function symbolConverter(text) {
  const symbolsInfo = getLocalStorage("symbols");
  const matches = text.match(regex);
  if (matches) {
    matches.forEach((textSymbol) => {
      symbolsInfo.data.forEach((retrievedSymbol) => {
        if (textSymbol === retrievedSymbol.symbol) {
          text = text.replace(
            textSymbol,
            `<img loading="eager" src="${retrievedSymbol.svg_uri}" alt="${retrievedSymbol.english}" width="15">`,
          );
        }
      });
    });
  }
  return text;
}
export function symbolInjector(text) {
  if (typeof text !== "string" && typeof text !== "object") {
    return text;
  } else if (Array.isArray(text)) {
    return text.map((symbol) => symbolConverter(`{${symbol}}`)).join(", ");
  }
  return symbolConverter(text);
}
// Get the parameters from the windown URL.
export function getParams(param, decoded = true) {
  if (decoded === true) {
    return new URLSearchParams(window.location.search).get(param);
  } else {
    const value = new URLSearchParams(window.location.search).get(param);
    return encodeURIComponent(value);
  }
}
// rework:search fetching system.
export default class search {
  constructor(params) {
    this.params = params;
  }
  getFavorites() {
    const favorites = getLocalStorage("favorites");
    if (favorites && Object.keys(favorites).length !== 0) {
      return favorites;
    } else {
      return null;
    }
  }
  async getCardData() {
    return await fetchData(`${baseURL}/cards/${this.params}`);
  }
  async getWildCard() {
    return await fetchData(`${baseURL}/cards/random`);
  }
  async getSearchData(
    url = `${baseURL}/cards/search?q=${this.params}&extras=true&unique=prints`,
  ) {
    const list = [];
    const info = await fetchData(url);
    this.nextPage = info.next_page;
    info.data.forEach((cardData) => list.push(cardData));
    return list;
  }
  async getSetData(url = `${baseURL}/sets/${this.params}`) {
    const setData = await fetchData(url);
    const setCards = [];
    let nextPage = setData.search_uri;
    while (nextPage) {
      const info = await fetchData(nextPage);
      setCards.push(...info.data);
      nextPage = info.next_page;
    }
    return { setData, setCards };
  }
}
