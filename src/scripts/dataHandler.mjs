const url = "https://api.scryfall.com/cards/named?q=Force of Will";
const userAgent = "TradingCardsInfoTracker/0.0.1";
const accept = "application/json";

export async function fetchData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
        "Accept": accept,
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