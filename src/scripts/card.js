import { cardData, getParams, updateLinks } from "./dataHandler.mjs";
import Visualizer from "./dataVisualization.mjs";

updateLinks();
const cardName = getParams("name");

const card = new cardData(cardName);

card.fetchCardData().then((cardInfo) => {
  const page = new Visualizer(cardInfo.name, cardInfo.object);
  console.log(cardInfo);
  page.run();
});
