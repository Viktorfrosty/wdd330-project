import CardDetails from "./card.mjs";
import { symbolsData, updateLinks } from "./dataHandler.mjs";
import visualizer from "./dataVisualization.mjs";

async function retrieve() {
  const response = await fetch(
    "https://api.scryfall.com/cards/search?q=c%3Awhite+mv%3D1",
  );
  if (response.ok) {
    const data = await response.json();
    console.log(data["data"]);
    return data["data"];
  }
}

const page = new visualizer("Home");

symbolsData().then(() => {
  updateLinks(); // erase later.
  retrieve().then((data) => {
    const cardEntries = Object.entries(data);
    cardEntries.forEach((card) => {
      console.log(card);
      console.log("lol");
      const info = new CardDetails(card);
      info.render();
    });
  });
  page.run();
});
