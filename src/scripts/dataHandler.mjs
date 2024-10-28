// Data handler module.
// API configurations.
const baseURL = "https://api.scryfall.com";
const initialSearchParameter =
  "&page=1&order=name&dir=asc&format=json&include_extras=true&include_multilingual=false&include_variations=false&unique=prints`";
const userAgent = "TradingCardsInfoTracker/0.0.1";
const accept = "application/json";
// Module configurations.
const symbolRegex = /\{.*?\}/g;
let info;
let list;
let pageNumber;
let order;
let dir;
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
  await delay(50);
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
  list = getLocalStorage("favorites");
  if (!list) {
    list = [];
  }
  list.push(card);
  setLocalStorage("favorites", list);
}
// check if in favorite function.
export function checkFavorite(card) {
  list = getLocalStorage("favorites");
  if (list) {
    return list.some((object) => card.id === object.id);
  } else {
    return false;
  }
}
// Icons retriever function.
export async function setIconRetriever(setId) {
  list = getLocalStorage("sets");
  info = null;
  list.data.forEach((set) => {
    if (setId === set.id) {
      info = `<img loading="lazy" src="${set.icon_svg_uri}" alt="${set.name} icon" width="20">`;
    }
  });
  return info;
}
// Information stored to make the loading faster.
export async function storedData() {
  const symbolsData = getLocalStorage("symbols");
  const SetsData = getLocalStorage("sets");
  if (!dataExpirationCheck("symbols-stamp") || !symbolsData) {
    info = await fetchData(`${baseURL}/symbology`);
    setLocalStorage("symbols", info);
    setLocalStorage("symbols-stamp", Date.now());
  }
  if (!dataExpirationCheck("sets-stamp") || !SetsData) {
    info = await fetchData(`${baseURL}/sets`);
    setLocalStorage("sets", info);
    setLocalStorage("sets-stamp", Date.now());
  }
}
// Symbols utilitarian functions.
function symbolConverter(text) {
  const symbolsInfo = getLocalStorage("symbols");
  const matches = text.match(symbolRegex);
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
// Get the favorites saved in the local storage.
export function resultRendering() {
  list = [];
  const storedData = getLocalStorage("favorites");
  let searchRange = getLocalStorage("search-range");
  if (!searchRange || (searchRange[0] > storedData.length && searchRange[1] > storedData.length)) {
    searchRange = [0, 49];
    setLocalStorage("search-range", searchRange);
  }
  const [start, end] = searchRange;
  for (let counter = start; counter <= end; counter++) {
    if (storedData[counter] !== undefined) {
      list.push(storedData[counter]);
    }
  }
  return list;
}
// Get the results saved in the local storage.
export function getResults() {
  return getLocalStorage("search-result");
}
// search fetching system.
export default class search {
  constructor(params) {
    this.params = params;
  }
  getFavorites() {
    list = getLocalStorage("favorites");
    if (list && Object.keys(list).length !== 0) {
      return list;
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
  // rework: getSearchData.
  async getSearchData(url = `${baseURL}/cards/search?q=${this.params}${initialSearchParameter}`) {
    list = [];
    pageNumber = getParams("page");
    order = getParams("alphabetical");
    dir = getParams("order");
    if (pageNumber !== 1 || dir !== "asc" || order !== "name") {
      info = await fetchData(
        `${baseURL}/cards/search?q=${this.params}&page=${pageNumber}&order=${order}&dir=${dir}&format=json&include_extras=true&include_multilingual=false&include_variations=false&unique=prints`,
      );
    } else {
      info = await fetchData(url);
    }
    info.data.forEach((cardData) => list.push(cardData));
    setLocalStorage("search-result", list);
  }
  // rework: getSetData.
  async getSetData(code = this.params) {
    let setData;
    const setsList = getLocalStorage("sets");
    list = [];
    pageNumber = getParams("page");
    order = getParams("alphabetical");
    dir = getParams("order");
    for (const object of setsList.data) {
      if (object.code === code) {
        setData = object;
        break;
      }
    }
    if (pageNumber !== 1 || dir !== "asc" || order !== "name") {
      info = await fetchData(
        `${baseURL}/cards/search?q=e%3A${this.params}&page=${pageNumber}&order=${order}&dir=${dir}&format=json&include_extras=true&include_multilingual=false&include_variations=false&unique=prints`,
      );
    } else {
      info = await fetchData(
        `${baseURL}/cards/search?q=e%3A${this.params}&page=1&order=${order}&dir=${dir}&format=json&include_extras=true&include_multilingual=false&include_variations=false&unique=prints`,
      );
    }
    info.data.forEach((cardData) => list.push(cardData));
    setLocalStorage("search-result", list);
    return setData;
  }
}
