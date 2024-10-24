import { cardDetails } from "./card.mjs";
import { cardData, getParams, symbolsData } from "./dataHandler.mjs";
import Visualizer from "./dataVisualization.mjs";

symbolsData().then(() => {
  const card = new cardData(getParams("id"));
  card.fetchData().then((cardInfo) => {
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
