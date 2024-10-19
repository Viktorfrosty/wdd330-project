// API configurations
const baseURL = "https://api.scryfall.com";
const userAgent = "TradingCardsInfoTracker/0.0.1";
const accept = "application/json";
const regex = /\{.*?\}/g;

// Fetch delay function
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Local storage functions
function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function dataExpirationCheck(key) {
  const storedTime = getLocalStorage(key);
  const timeDifference = Date.now() - storedTime;
  return storedTime && timeDifference < 86400000;
}

// Function to update links with query parameters
export function updateLinks() {
  const links = [
    {
      id: "card-link",
      url: "card.html?id=bc140950-d7d0-46d3-98a0-8d1453f4b0cf",
    },
    { id: "set-link", url: "set.html?name=aer" },
  ];
  links.forEach((link) => {
    const element = document.getElementById(link.id);
    if (element) {
      element.href = link.url;
      console.log(`${link.id} success!`);
    }
  });
}

// Function to fetch data from API
async function fetchData(url) {
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
    throw new Error(`Error fetching data from ${url}`);
  }
}

export async function setIconRetriever(setId) {
  const set = await fetchData(`${baseURL}/sets/${setId}`);
  return `<img loading="lazy" src="${set.icon_svg_uri}" alt="${set.name} icon" width="20">`;
}

export async function symbolsData() {
  const symbolsData = getLocalStorage("symbols");
  if (!dataExpirationCheck("symbols-stamp") || !symbolsData) {
    const data = await fetchData(`${baseURL}/symbology`);
    setLocalStorage("symbols", data);
    setLocalStorage("symbols-stamp", Date.now());
  }
}

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

export function getParams(param) {
  return new URLSearchParams(window.location.search).get(param);
}

export default class searchData {
  constructor(params) {
    this.params = params;
  }
  async fetchData() {
    return await fetchData(`${baseURL}/cards/${this.params}`);
  }
}

export class cardData {
  constructor(id) {
    this.id = id;
  }
  async fetchData() {
    return await fetchData(`${baseURL}/cards/${this.id}`);
  }
}

export class setData {
  constructor(setId) {
    this.setId = setId;
  }

  async fetchData() {
    return await fetchData(`${baseURL}/sets/${this.setId}`);
  }
}
