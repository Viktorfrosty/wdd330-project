import { cardDetails } from "./card.mjs";
import search, { getParams, storedData } from "./dataHandler.mjs";
import Visualizer from "./dataVisualization.mjs";

storedData().then(() => {
  const card = new search(getParams("s"));
  card.getCardData().then((cardInfo) => {
    const misc = `${cardInfo.set_name} (${cardInfo.set.toUpperCase()})`;
    const page = new Visualizer(
      cardInfo.name,
      cardInfo.object,
      misc,
      cardInfo.collector_number,
    );
    const info = new cardDetails(cardInfo);
    page.run();
    info.render();
  });
});
