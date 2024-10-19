// Data handler module.

// API call requirements.
const baseURL = "https://api.scryfall.com";
const userAgent = "TradingCardsInfoTracker/0.0.1";
const accept = "application/json";

// function requeirements.
const regex = /\{.*?\}/g;

// Function to update the links with query parameters
export function updateLinks() {
  const cardLink = document.getElementById("card-link");
  const setLink = document.getElementById("set-link");
  if (cardLink) {
    cardLink.href = "card.html?id=bc140950-d7d0-46d3-98a0-8d1453f4b0cf";
    console.log("cardlink success!");
  }
  if (setLink) {
    setLink.href = "set.html?name=aer";
    console.log("setLink success!");
  }
}

// Required API fetch delay.
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// save data to local storage.
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Retrieve data from localstorage.
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Check if the information is over the 24 hours mark.
function dataExpirationCheck(key) {
  const storedTime = getLocalStorage(key);
  const timeDifference = Date.now() - storedTime;
  if (storedTime) {
    if (timeDifference >= 86400000) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

// Fetch and extract the set icon.
export async function setIconRetriever(setId) {
  const setData = `${baseURL}/sets/${setId}`;
  await delay(100);
  const response = await fetch(setData, {
    headers: {
      "User-Agent": userAgent,
      Accept: accept,
    },
  });
  if (response.ok) {
    const set = await response.json();
    return `<img loading="lazy" src="${set.icon_svg_uri}" alt="${set.name} icon" width="20">`;
  } else {
    console.log("Error: setIconRetriever function");
  }
}

// Fetch, save and renovate the symbols data.
export async function symbolsData() {
  const symbolsData = getLocalStorage("symbols");
  const isValid = dataExpirationCheck("symbols-stamp");
  if (isValid === false || (isValid === true && !symbolsData)) {
    const symbolsLink = `${baseURL}/symbology`;
    await delay(50);
    const response = await fetch(symbolsLink, {
      headers: {
        "User-Agent": userAgent,
        Accept: accept,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setLocalStorage("symbols", data);
      setLocalStorage("symbols-stamp", Date.now());
    } else {
      console.log("Error: symbolData function.");
    }
  }
}

function symbolConverter(text) {
  const symbolsInfo = getLocalStorage("symbols");
  const symbolslisted = [];
  const matches = text.match(regex);
  if (matches) {
    symbolslisted.push(...matches);
  }
  if (symbolslisted.length >= 1) {
    symbolslisted.forEach((textSymbol) => {
      symbolsInfo.data.forEach((retrievedSymbol) => {
        if (textSymbol === retrievedSymbol.symbol) {
          const imgElement = `<img loading="eager" src="${retrievedSymbol.svg_uri}" alt="${retrievedSymbol.english}" width="15">`;
          text = text.replace(textSymbol, imgElement);
        }
      });
    });
    return text;
  } else {
    return text;
  }
}

// Convert every text symbol into an image symmbol
export function symbolInjector(text) {
  if (typeof text !== "string" && typeof text !== "object") {
    return text;
  } else if (Array.isArray(text)) {
    let reworkedSymbols = text.map((textSymbol) => {
      textSymbol = `{${textSymbol}}`;
      return symbolConverter(textSymbol);
    });
    return reworkedSymbols.join(", ");
  } else {
    return symbolConverter(text);
  }
}

// search parameter retriever.
export function getParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(param);
  return value;
}

// list data retriever.
export default class search {
  constructor() {}
  execute() {}
}

// card data retriever.
export class cardData {
  constructor(id) {
    this.id = id;
  }
  async fetchData() {
    const requestedUrl = `${baseURL}/cards/${this.id}`;
    await delay(100);
    const response = await fetch(requestedUrl, {
      headers: {
        "User-Agent": userAgent,
        Accept: accept,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  }
}

// set data retriever.
export class setData {
  constructor(setId) {
    this.setId = setId;
  }

  async fetchData() {
    const requestedUrl = `${baseURL}/sets/${this.setId}`;
    console.log(`API link: ${requestedUrl}`);
    await delay(100);
    const response = await fetch(requestedUrl, {
      headers: {
        "User-Agent": userAgent,
        Accept: accept,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log("Error: fetchSetData function");
    }
  }
}
