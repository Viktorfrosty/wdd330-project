// Data handler module.

// API call requirements.
const baseURL = "https://api.scryfall.com";
const userAgent = "TradingCardsInfoTracker/0.0.1";
const accept = "application/json";

// Function to update the links with query parameters
export function updateLinks() {
  const cardLink = document.getElementById('card-link');
  const setLink = document.getElementById('set-link');
  if (cardLink) {
    cardLink.href = 'card.html?name=black+lotus';
    console.log("cardlink success!");
  }
  if (setLink) {
    setLink.href = 'set.html?name=aer';
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
  async fetchCardData() {
    try {
      const requestedUrl = `${baseURL}/cards/named?fuzzy=${this.cardName}`;
      console.log(`API link: ${requestedUrl}`)
      const response = await fetch(requestedUrl, {
        headers: {
          "User-Agent": userAgent,
          Accept: accept,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  }
}

// set data retriever.
export class setData {
  constructor(setName) {
    this.setName = setName;
  }
  async fetchCardData() {
    try {
      const requestedUrl = `${baseURL}/sets/${this.setName}`;
      console.log(`API link: ${requestedUrl}`)
      const response = await fetch(requestedUrl, {
        headers: {
          "User-Agent": userAgent,
          Accept: accept,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  }
}
