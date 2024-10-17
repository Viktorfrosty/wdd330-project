export async function fetchData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "TradingCardsInfoTracker/0.0.1",
        Accept: "application/json",
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
