import cardDetails from "./card.mjs";
import { cardData, getParams, updateLinks } from "./dataHandler.mjs";
import Visualizer from "./dataVisualization.mjs";

updateLinks();
const cardName = getParams("name");

const card = new cardData(cardName);

card.fetchCardData().then((cardInfo) => {
    const misc = `${cardInfo.set_name} (${cardInfo.set.toUpperCase()})`;
    const page = new Visualizer(cardInfo.name, cardInfo.object, misc);
    const info = new cardDetails(cardInfo);
    console.log(`Retrieved info:`);
    console.log(cardInfo);
    page.run();
    info.render();
  });
 // 'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg?1614638838' 
