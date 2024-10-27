// Data handler module.

// API configurations.
const baseURL = "https://api.scryfall.com";
const initialSearchParameter =
  "&page=1&order=name&dir=asc&format=json&include_extras=true&include_multilingual=false&include_variations=false&unique=prints`";
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
export async function fetchData(url, search = false) {
  await delay(50);
  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      Accept: accept,
    },
  });
  if (response.ok) {
    return response.json();
  } else if (search) {
    return null;
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
// rework: Get the result saved in the local storage.
export function resultRendering() {
  let result = [];
  const storedData = getLocalStorage("search-result");
  let searchRange = getLocalStorage("search-range");
  if (!searchRange || (searchRange[0] > storedData.length && searchRange[1] > storedData.length)) {
    searchRange = [0, 49];
    setLocalStorage("search-range", searchRange);
  }
  const [start, end] = searchRange;
  for (let counter = start; counter <= end; counter++) {
    if (storedData[counter] !== undefined) {
      result.push(storedData[counter]);
    }
  }
  return result;
}

export function getResults() {
  return getLocalStorage("search-result");
}

// rework:search fetching system.
export default class search {
  constructor(params) {
    this.params = params;
  }
  getFavorites() {
    const favorites = getLocalStorage("favorites");
    if (favorites && Object.keys(favorites).length !== 0) {
      setLocalStorage("search-result", favorites);
      return getLocalStorage("search-result");
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
  async getSearchData(url = `${baseURL}/cards/search?q=${this.params}${initialSearchParameter}`) {
    let pageNumber = getParams("page");
    console.log(pageNumber);
    let pageCount = 1;
    let list = [];
    const info = await fetchData(url);
    let nextPage = `${baseURL}/cards/search?q=${this.params}&page=${pageCount + 1}&order=name&dir=asc&format=json&include_extras=true&include_multilingual=false&include_variations=false&unique=prints`;
    console.log(nextPage);
    info.data.forEach((cardData) => list.push(cardData));
    while (nextPage) {
      const nextPageInfo = await fetchData(nextPage, true);
      if (nextPage !== null) {
        pageCount++;
        console.log("counting");
      } else {
        nextPage = nextPageInfo;
        console.log("finished?");
      }
    }
    setLocalStorage("total-pages", pageCount);
    setLocalStorage("search-result", list);
  }
  async getSetData(id = this.params) {
    let pageCounter;
    let setData;
    const setsList = getLocalStorage("sets");
    for (const object of setsList.data) {
      if (object.id === id) {
        setData = object;
        break;
      }
    }
    const setCards = [];
    let nextPage = setData.search_uri;
    while (nextPage) {
      const info = await fetchData(nextPage);
      setCards.push(...info.data);
      nextPage = info.next_page;
    }
    setLocalStorage("search-result", setCards);
    return setData;
  }
}
