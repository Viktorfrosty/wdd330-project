import cardDetails from "./card.mjs";
import {
  cardData,
  getParams,
  symbolsData,
  updateLinks,
} from "./dataHandler.mjs";
import Visualizer from "./dataVisualization.mjs";

symbolsData().then(() => {
  updateLinks(); // erase later.
  const id = getParams("id");
  const card = new cardData(id);
  card.fetchData().then((cardInfo) => {
    const misc = `${cardInfo.set_name} (${cardInfo.set.toUpperCase()})`;
    const page = new Visualizer(cardInfo.name, cardInfo.object, misc);
    const info = new cardDetails(cardInfo);
    page.run();
    info.render();
  });
});
