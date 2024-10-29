import { cardDetails } from "./card.mjs";
import search, { getParams, storedData } from "./dataHandler.mjs";
import Visualizer, { nightMode } from "./dataVisualization.mjs";

const nm = new nightMode();
nm.load();

storedData().then(() => {
  const card = new search(getParams("s"));
  card.getCardData().then((cardInfo) => {
    const misc = `${cardInfo.set_name} (${cardInfo.set.toUpperCase()})`;
    let cardName = "";
    if (!cardInfo.flavor_name) {
      cardName = cardInfo.name;
    } else {
      cardName = cardInfo.flavor_name;
    }
    const page = new Visualizer(cardName, cardInfo.object, misc, cardInfo.collector_number);
    const info = new cardDetails(cardInfo);
    page.run();
    info.render();
  });
});
