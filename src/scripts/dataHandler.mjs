// Data handler module.

// API call requirements.
const baseURL = "https://api.scryfall.com";
const userAgent = "TradingCardsInfoTracker/0.0.1";
const accept = "application/json";

// function requeirements.
const regex = /\{.*?\}/g;

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
      console.log("Stamp found; it is expired.");
      return false;
    } else {
      console.log("Stamp found; it is not expired.");
      return true;
    }
  } else {
    console.log("Stamp not found.");
    return false;
  }
}

// Fetch and extract the set icon.
export async function setIconRetriever(setId) {
  const setData = `${baseURL}/sets/${setId}`;
  console.log(`API link: ${setData}`);
  await delay(100);
  const response = await fetch(setData, {
    headers: {
      "User-Agent": userAgent,
      Accept: accept,
    },
  });
  if (response.ok) {
    const set = await response.json();
    console.log(`${set.name} Set icon link: ${set.icon_svg_uri}`);
    return `<img loading="lazy" src="${set.icon_svg_uri}" alt="${set.name} icon" width="20">`;
  } else {
    console.log("Error: setIconRetriever function");
  }
}

// Fetch, save and renovate the symbols data.
export async function symbolsData() {
  const symbolsData = getLocalStorage("symbols");
  const isValid = dataExpirationCheck("symbols-stamp");
  console.log(`Symbols are valid: ${isValid}`);
  if (isValid === false || (isValid === true && !symbolsData)) {
    const symbolsLink = `${baseURL}/symbology`;
    console.log(symbolsLink);
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
      console.log("symbols and symbols-stamp saved in the local storage.");
    } else {
      console.log("Error: symbolData function.");
    }
  } else {
    console.log("symbolsData function skipped.");
  }
}

// Convert every text symbol into an image symmbol
export function symbolConverter(text) {
  const symbolsInfo = getLocalStorage("symbols");
  console.log(`Pre-worked text: ${text}`);
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
          console.log(
            `symbolRetriever function test success. symbol description: ${retrievedSymbol.english} svg symbol link: ${retrievedSymbol.svg_uri}`,
          );
          text = text.replace(textSymbol, imgElement);
        }
      });
    });
    console.log(`Post-worked text: ${text}`);
    return text;
  } else {
    console.log("symbolConverter function skipped.");
    return text;
  }
}

// Function to update the links with query parameters
export function updateLinks() {
  const cardLink = document.getElementById("card-link");
  const setLink = document.getElementById("set-link");
  if (cardLink) {
    cardLink.href = "card.html?name=black+lotus";
    console.log("cardlink success!");
  }
  if (setLink) {
    setLink.href = "set.html?name=aer";
    console.log("setLink success!");
  }
}

// search parameter retriever.
export function getParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(param);
  console.log(`Parameter Value: ${value}`);
  return value;
}

// list data retriever.
export default class listData {}

// card data retriever.
export class cardData {
  constructor(cardName) {
    this.cardName = cardName;
  }

  async fetchData() {
    const requestedUrl = `${baseURL}/cards/named?fuzzy=${this.cardName}`;
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
      console.log("Error: fetchCardData function");
    }
  }
}

// set data retriever.
export class setData {
  constructor(setName) {
    this.setName = setName;
  }

  async fetchData() {
    const requestedUrl = `${baseURL}/sets/${this.setName}`;
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
