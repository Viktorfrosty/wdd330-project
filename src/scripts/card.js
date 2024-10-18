import cardDetails from "./card.mjs";
import {
  cardData,
  getParams,
  symbolsData,
  updateLinks,
} from "./dataHandler.mjs";
import Visualizer from "./dataVisualization.mjs";

symbolsData();
updateLinks(); // erase later.

const cardName = getParams("name");
const card = new cardData(cardName);

card.fetchData().then((cardInfo) => {
  const misc = `${cardInfo.set_name} (${cardInfo.set.toUpperCase()})`;
  const page = new Visualizer(cardInfo.name, cardInfo.object, misc);
  const info = new cardDetails(cardInfo);
  console.log(`Retrieved info:`);
  console.log(cardInfo);
  page.run();
  info.render();
});
