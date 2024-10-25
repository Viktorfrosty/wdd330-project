// API configurations
const baseURL = "https://api.scryfall.com";
const userAgent = "TradingCardsInfoTracker/0.0.1";
const accept = "application/json";
const regex = /\{.*?\}/g;
// Fetch delay function
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Local storage functions.
function setLocalStorage(key, data) {
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
export default class search {
  constructor(params) {
    this.params = params;
  }
  async getSearchData() {
    let list = [];
    let nextPage = `${baseURL}/cards/search?q=${this.params}&extras=true&unique=prints`;
    console.log(nextPage);
    while (nextPage) {
      const info = await fetchData(nextPage);
      console.log(info);
      info.data.forEach((cardData) => {
        list.push(cardData);
      });
      // nextPage = info.next_page || null;
      console.log(info.next_page);
      nextPage = null;
    }
    return list;
  }
  async getCardData() {
    return await fetchData(`${baseURL}/cards/${this.params}`);
  }
  async getSetData() {
    const setData = await fetchData(`${baseURL}/sets/${this.params}`);
    const setCards = [];
    // let nextPage = setData.search_uri;
    let nextPage = null;
    console.log(setData);
    while (nextPage) {
      const info = await fetchData(nextPage);
      setCards.push(...info.data);
      // nextPage = info.next_page || null;
      nextPage = null;
    }
    return { setData, setCards };
  }
}
